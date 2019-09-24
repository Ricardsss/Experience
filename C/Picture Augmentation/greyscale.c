#include <stdio.h>
#include <stdlib.h>
#include "bitmap.h"

void greyscale_filter(Bitmap *bmp) {
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
        
        //create new greyscaled pixel
        unsigned char grey = (pixel->blue + pixel->green + pixel->red) / 3;
        int j;
        
        for (j = 0; j < 3; j++) {
            
            //write the pixel to stdout
            if (fwrite(&grey, 1,  1, stdout) != 1) {
                perror("write to stdout");
                exit(1);
            }
        }
    }
}

int main() {
    run_filter(greyscale_filter, 1);
    
    return 0;
}