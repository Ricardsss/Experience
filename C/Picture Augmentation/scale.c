#include <stdio.h>
#include <stdlib.h>
#include "bitmap.h"

//the global variable to store the scale factor
int scale_factor;

void scale_filter(Bitmap *bmp) {
    //store the originals width and height
    int original_width = bmp->width;
    int original_height = bmp->height;
    //store the new width and height
    int new_width = bmp->header[BMP_WIDTH_OFFSET + 3] << 24 
    | bmp->header[BMP_WIDTH_OFFSET + 2] << 16 
    | bmp->header[BMP_WIDTH_OFFSET + 1] << 8 | bmp->header[BMP_WIDTH_OFFSET];
    int new_height = bmp->header[BMP_HEIGHT_OFFSET + 3] << 24 
    | bmp->header[BMP_HEIGHT_OFFSET + 2] << 16 
    | bmp->header[BMP_HEIGHT_OFFSET + 1] << 8 
    | bmp->header[BMP_HEIGHT_OFFSET];
    
    //array storing every pixel
    Pixel ** pixels = malloc(original_height * sizeof(Pixel *));
    int i;
    int j;
    
    for (i = 0; i < original_height; i++) {
        pixels[i] = malloc(original_width * sizeof(Pixel));
    }
    
    //read in every pixel
    for (i = 0; i < original_height; i++) {
        
        for (j = 0; j < original_width; j++) {
            
            if (fread(&((pixels[i][j]).blue), 1, 1, stdin) != 1) {
                perror("read from stdin");
                exit(1);
            }
            
            if (fread(&((pixels[i][j]).green), 1, 1, stdin) != 1) {
                perror("read from stdin");
                exit(1);
            }
            
            if (fread(&((pixels[i][j]).red), 1, 1, stdin) != 1) {
                perror("read from stdin");
                exit(1);
            }
        }
    }
    
    int k;
    int l;
    
    //scale new pixel and write it to stdout
    for (k = 0; k < new_height; k++) {
        
        for (l = 0; l < new_width; l++) {
            
            if (fwrite(&(pixels[k / scale_factor][l / scale_factor].blue), 1,  1, stdout) != 1) {
                perror("write to stdout");
                exit(1);
            }
        
            if (fwrite(&(pixels[k / scale_factor][l / scale_factor].green), 1,  1, stdout) != 1) {
                perror("write to stdout");
                exit(1);
            }
        
            if (fwrite(&(pixels[k / scale_factor][l / scale_factor].red), 1,  1, stdout) != 1) {
                perror("write to stdout");
                exit(1);
            }
        }
    }
    
    //free dynamically stored memory
    for (i = 0; i < original_height; i++) {
        free(pixels[i]);
    }
    free(pixels);
    
    bmp->width = new_width;
    bmp->height = new_height;
}

int main(int argc, char **argv) {
    scale_factor = (int) strtol(argv[1], NULL, 10);
    run_filter(scale_filter, scale_factor);
    
    return 0;
}