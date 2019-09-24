#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include "bitmap.h"

#define ERROR_MESSAGE "Warning: one or more filter had an error, so the output image may not be correct.\n"
#define SUCCESS_MESSAGE "Image transformed successfully!\n"


/*
 * Check whether the given command is a valid image filter, and if so,
 * run the process.
 *
 * We've given you this function to illustrate the expected command-line
 * arguments for image_filter. No further error-checking is required for
 * the child processes.
 */
void run_command(const char *cmd) {
    if (strcmp(cmd, "copy") == 0 || strcmp(cmd, "./copy") == 0 ||
        strcmp(cmd, "greyscale") == 0 || strcmp(cmd, "./greyscale") == 0 ||
        strcmp(cmd, "gaussian_blur") == 0 || strcmp(cmd, "./gaussian_blur") == 0 ||
        strcmp(cmd, "edge_detection") == 0 || strcmp(cmd, "./edge_detection") == 0) {
        execl(cmd, cmd, NULL);
    } else if (strncmp(cmd, "scale", 5) == 0) {
        // Note: the numeric argument starts at cmd[6]
        execl("scale", "scale", cmd + 6, NULL);
    } else if (strncmp(cmd, "./scale", 7) == 0) {
        // Note: the numeric argument starts at cmd[8]
        execl("./scale", "./scale", cmd + 8, NULL);
    } else {
        fprintf(stderr, "Invalid command '%s'\n", cmd);
        exit(1);
    }
}

// TODO: Complete this function.
int main(int argc, char **argv) {
    
    if (argc < 3) {
        printf("Usage: image_filter input output [filter ...]\n");
        exit(1);
    }
    FILE * input_file = fopen(argv[1], "r");
    FILE * output_file = fopen(argv[2], "w");
    
    //change stdin to point to the input file
    if ((dup2(fileno(input_file), fileno(stdin))) == -1) {
        perror("dup2");
        exit(1);
    }
    
    if (close(fileno(input_file)) < 0) {
        perror("close");
        exit(1);
    }
    
    //if not filter agument, copy the image by default
    if (argc == 3) {
        int pid; 
        pid = fork();
        
        if (pid > 0) {
            int status;
            
            if (wait(&status) != -1)  {
                
                if (WIFEXITED(status)) {
                    
                    if (WEXITSTATUS(status) == 1) {
                        printf(ERROR_MESSAGE);
                        exit(1);
                    }
                    
                    else if (WEXITSTATUS(status) == 2) {
                        perror("dup2");
                        exit(1);
                    }
                    
                    else if (WEXITSTATUS(status) == 3) {
                        perror("close");
                        exit(1);
                    }
                } 
            }
        }
        
        else if (pid == 0) {
        
            if ((dup2(fileno(output_file), fileno(stdout))) == -1) {
                perror("dup2");
                exit(2);
            }
            
            if (close(fileno(output_file)) < 0) {
                perror("close");
                exit(3);
            }
            run_command("copy");
            perror("execl");
        }
        
        else if (pid < 0) {
            perror("fork");
            exit(1);
        }
    }
    
    else if (argc > 3) {
        int number_of_filters = argc - 3;
        int r;
        int fd[2 * number_of_filters];
        //the file descriptor with the output from the previous filter
        int filter_counter;
        
        for (filter_counter = 0; filter_counter < number_of_filters; filter_counter++) {
            
             if (pipe(fd + 2 * filter_counter) < 0) {
                perror("pipe");
                exit(2);
            }
        }
        
        for (filter_counter = 0; filter_counter < number_of_filters; filter_counter++) {
            r = fork();
            
            if (r == 0) {
                
                //not the first filter
                if (filter_counter != 0) {
                    
                    //change stdin to point to stdout of the previous filter
                    if ((dup2(fd[(filter_counter - 1) * 2], fileno(stdin))) == -1) {
                        perror("dup2");
                        exit(2);
                    }
                }
                
                //not the last filter
                if ((filter_counter + 1) != number_of_filters) {
                    
                    //send the output of the filter to the pipe
                    if ((dup2(fd[(filter_counter * 2) + 1], fileno(stdout))) == -1) {
                        perror("dup2");
                        exit(2);
                    }
                }
                
                //the last filter
                if ((filter_counter + 1) == number_of_filters) {
                    
                    //send the output to the output file
                    if ((dup2(fileno(output_file), fileno(stdout))) == -1) {
                        perror("dup2");
                        exit(2);
                    }
                }
                int i;
                
                //close all the pipes in the child process
                for (i = 0; i < 2 * number_of_filters; i++) {
                    
                    if (close(fd[i]) < 0) {
                        perror("close");
                        exit(3);
                    }
                }
                run_command(argv[argc - number_of_filters + filter_counter]);
                perror("execl");
                exit(1);
            }
        }
        int j;
        
        //close all the pipes in the parent process
        for (j = 0; j < 2 * number_of_filters; j++) {
            
            if (close(fd[j]) < 0) {
                perror("close");
                exit(3);
            }
        }
        
        //wait for the child processes to finish
        for (j = 0; j < number_of_filters; j++) {
            int status2;
        
            if (wait(&status2) != -1)  {
            
                if (WIFEXITED(status2)) {
                
                    if (WEXITSTATUS(status2) == 1) {
                        printf(ERROR_MESSAGE);
                        exit(1);
                    }
                } 
            }
        }
    }
    printf(SUCCESS_MESSAGE);
    
    return 0;
}