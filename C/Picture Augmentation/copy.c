#include <stdio.h>
#include <stdlib.h>
#include "bitmap.h"

/*
 * Main filter loop.
 * This function is responsible for doing the following:
 *   1. Read in pixels one at a time (because copy is a pixel-by-pixel transformation).
 *   2. Immediately write out each pixel.
 *
 * Note that this function should allocate space only for a single Pixel;
 * do *not* store more than one Pixel at a time, it isn't necessary here!
 */
void copy_filter(Bitmap *bmp) {
    // TODO: Complete this function.
    int width = bmp->width;
    int height = bmp->height;
    Pixel * pixel = malloc(sizeof(Pixel));
    int loops = width * height;
    
    int i;
    
    for (i = 0; i < loops; i++) {
        
        //read the pixel from stdin
        if (fread(&(pixel->blue), 1, 1, stdin) != 1) {
            perror("read from stdin");
            exit(1);
        }
        
        if (fread(&(pixel->green), 1, 1, stdin) != 1) {
            perror("read from stdin");
            exit(1);
        }
        
        if (fread(&(pixel->red), 1, 1, stdin) != 1) {
            perror("read from stdin");
            exit(1);
        }
        
        //write the pixel to stdout
        if (fwrite(&(pixel->blue), 1,  1, stdout) != 1) {
            perror("write to stdout");
            exit(1);
        }
        
        if (fwrite(&(pixel->green), 1,  1, stdout) != 1) {
            perror("write to stdout");
            exit(1);
        }
        
        if (fwrite(&(pixel->red), 1,  1, stdout) != 1) {
            perror("write to stdout");
            exit(1);
        }
    }
}

int main() {
    // Run the filter program with copy_filter to process the pixels.
    // You shouldn't need to change this implementation.
    run_filter(copy_filter, 1);
    
    return 0;
}