#include <string.h>
#include <stdlib.h>

#include "free_list.h"

/* Implement the best fit algorithm to find free space for the
   simulated file data.
 */

int get_free_block(FS *fs, int size) {
        Freeblock * result = fs->freelist;
        int offset = -1;
        
        while (result != NULL) {
                
                if (result->length >= size) {
                        break;
                }
                result = result->next;
        }
        
        if (result != NULL) {
                Freeblock * temp = fs->freelist;
                
                while (temp != NULL) {
                        
                        if ((temp->length >= size) 
                                && (temp->length < result->length)) {
                                result = temp;
                        }
                        temp = temp->next;
                }
                
                if (result->length > size) {
                        offset = result->offset;
                        result->length -= size;
                        result->offset += size;
                }
        
                else if (result->length == size) {
                        offset = result->offset;
                        Freeblock * temp2 = fs->freelist;
            
                        while (temp2->next != NULL) {
                
                                if (temp2->next->offset == result->offset) {
                                        temp2->next = result->next;
                                        break;
                                }
                                
                                else if (temp2->offset == result->offset) {
                                        fs->freelist = fs->freelist->next;
                                        break;
                                }
                                temp2 = temp2->next;
                                        
                        }
                }
        }
        
        return offset;
}