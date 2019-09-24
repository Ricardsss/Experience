#include <stdio.h>
#include <stdlib.h>
#include "bitmap.h"

void gaussian_blur_filter(Bitmap *bmp) {
    Pixel result;
    int width = bmp->width;
    int height = bmp->height;
    Pixel ** pixel_rows = malloc(3 * sizeof(Pixel *));
    int i;
    
    for (i = 0; i < 3; i++) {
        pixel_rows[i] = malloc(width * sizeof(Pixel));
    }
    Pixel ** transformation_rows = malloc(3 * sizeof(Pixel *));
    
    for (i = 0; i < 3; i++) {
        transformation_rows[i] = malloc(3 * sizeof(Pixel));
    }
    int j;
    int k;
    int l;
    int m;
    int n;
    
    //read in the first 3 rows of pixels
    for (k = 0; k < 3; k++) {
        
        for (l = 0; l < width; l++) {
            
            if (fread(&((pixel_rows[k][l]).blue), 1, 1, stdin) != 1) {
                perror("read from stdin");
                exit(1);
            }
            
            if (fread(&((pixel_rows[k][l]).green), 1, 1, stdin) != 1) {
                perror("read from stdin");
                exit(1);
            }
            
            if (fread(&((pixel_rows[k][l]).red), 1, 1, stdin) != 1) {
                perror("read from stdin");
                exit(1);
            }     
        }
    }
    
    //for every row
    for (j = 0; j < height; j++) {
        
        //the first or second row
        if ((j == 0) || (j == 1)) {
            
            //for every column
            for (l = 0; l < width; l++) {
                
                //the first column
                if (l == 0) {
                    
                    //create the 3x3 pixel row
                    for (m = 0; m < 3; m++) {
                        
                        for (n = 0; n < 3; n++) {
                            transformation_rows[m][n] = pixel_rows[m][n];
                        }
                    }
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    //write the pixel to stdout
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
                
                //the first of last column
                else if ((l == 1) || ((l + 1) == width)) {
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
                
                //the columns between the second column and the last column(exclusive)
                else if ((l > 1) && ((l + 1) != width)) {
                    
                    for (m = 0; m < 3; m++) {
                        
                        for (n = 0; n < 3; n++) {
                            transformation_rows[m][n] = pixel_rows[m][l - 1 + n];
                        }
                    }
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
            } 
        }
        
        //the rows between the second row and the last row(exclusive)
        else if ((j > 1) && ((j + 1) != height)) {
            
            for (m = 0; m < 2; m++) {
                
                for (l = 0; l < width; l++) {
                    
                    pixel_rows[m][l] = pixel_rows[m + 1][l];
                }
            }
            
            for (l = 0; l < width; l++) {
                
                if (fread(&((pixel_rows[2][l]).blue), 1, 1, stdin) != 1) {
                    perror("read from stdin");
                    exit(1);
                }
            
                if (fread(&((pixel_rows[2][l]).green), 1, 1, stdin) != 1) {
                    perror("read from stdin");
                    exit(1);
                }
            
                if (fread(&((pixel_rows[2][l]).red), 1, 1, stdin) != 1) {
                    perror("read from stdin");
                    exit(1);
                }
            }
            
            for (l = 0; l < width; l++) {
                
                if (l == 0) {
                    
                    for (m = 0; m < 3; m++) {
                        
                        for (n = 0; n < 3; n++) {
                            transformation_rows[m][n] = pixel_rows[m][n];
                        }
                    }
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
                
                else if ((l == 1) || ((l + 1) == width)) {
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
                
                else if ((l > 1) && ((l + 1) != width)) {
                    
                    for (m = 0; m < 3; m++) {
                        
                        for (n = 0; n < 3; n++) {
                            transformation_rows[m][n] = pixel_rows[m][l - 1 + n];
                        }
                    }
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
            }
        }
        
        //the last row
        else if ((j + 1) == height) {
            
            for (l = 0; l < width; l++) {
                
                if (l == 0) {
                    
                    for (m = 0; m < 3; m++) {
                        
                        for (n = 0; n < 3; n++) {
                            transformation_rows[m][n] = pixel_rows[m][n];
                        }
                    }
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
                
                else if ((l == 1) || ((l + 1) == width)) {
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
                
                else if ((l > 1) && ((l + 1) != width)) {
                    
                    for (m = 0; m < 3; m++) {
                        
                        for (n = 0; n < 3; n++) {
                            transformation_rows[m][n] = pixel_rows[m][l - 1 + n];
                        }
                    }
                    result = apply_gaussian_kernel(transformation_rows[0], transformation_rows[1], transformation_rows[2]);
                    
                    if (fwrite(&(result.blue), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.green), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
        
                    if (fwrite(&(result.red), 1,  1, stdout) != 1) {
                        perror("write to stdout");
                        exit(1);
                    }
                }
            }
        }
    }
    
    //free all the dynamically stored memory
    for (i = 0; i < 3; i++) {
        free(pixel_rows[i]);
    }
    free(pixel_rows);
    
    for (i = 0; i < 3; i++) {
        free(transformation_rows[i]);
    }
    free(transformation_rows);
}

int main() {
    run_filter(gaussian_blur_filter, 1);
    
    return 0;
}