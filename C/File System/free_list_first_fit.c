#include <string.h>
#include <stdlib.h>

#include "free_list.h"

/* Implement the first fit algorithm to find free space for the
   simulated file data.
 */

int get_free_block(FS *fs, int size) {
    Freeblock * temp = fs->freelist;
    int offset = -1;
    
    while (temp != NULL) {
        
        if (temp->length > size) {
            offset = temp->offset;
            temp->length -= size;
            temp->offset += size;
            break;
        }
        
        else if (temp->length == size) {
            offset = temp->offset;
            Freeblock * temp2 = fs->freelist;
            
            while (temp2->next != NULL) {
                
                if (temp2->next->offset == temp->offset) {
                    temp2->next = temp->next;
                    break;
                }
                
                else if (temp2->offset == temp->offset) {
                    fs->freelist = fs->freelist->next;
                    break;
                }
                temp2 = temp2->next;
            }
            break;
        }
        
        else {
            temp = temp->next;
        }
    }

    return offset;
}