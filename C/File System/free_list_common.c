/* The functions operate on a linked list of free blocks.  Each node of the
 * list contains the starting location and the length of a free block.
 * 
 */

#include <string.h>
#include <stdlib.h>

#include "free_list.h"

/* Give free space back to the free list.  Since the list is ordered by 
 * location, this function is the same for both algorithms.
 */
void add_free_block(FS *fs, int location, int size) {
        Freeblock * block = malloc(sizeof(Freeblock));
        block->offset = location;
        block->length = size;
        block->next = NULL;
        
        if (fs->freelist == NULL) {
         fs->freelist = block;
        }
        
        else {
         int count = 0;
         Freeblock * temp = fs->freelist;
         
         while (temp != NULL) {
          
          if (temp->offset > block->offset) {
           break;
          }
          
          else {
           temp = temp->next;
           count++;
          }
         }
         
         if (count == 0) {
          block->next = fs->freelist;
          fs->freelist = block;
          
          if ((fs->freelist->offset + fs->freelist->length) == 
           fs->freelist->next->offset) {
           fs->freelist->length += fs->freelist->next->length;
           fs->freelist->next = fs->freelist->next->next;
          }
         }
         
         else if (count == 1) {
          block->next = fs->freelist->next;
          fs->freelist->next = block;
          
          if ((fs->freelist->offset + fs->freelist->length) == 
           fs->freelist->next->offset) {
           fs->freelist->length += fs->freelist->next->length;
           fs->freelist->next = fs->freelist->next->next;
           
           if ((fs->freelist->offset + fs->freelist->length) == 
            fs->freelist->next->offset) {
            fs->freelist->length += fs->freelist->next->length;
            fs->freelist->next = fs->freelist->next->next;
           }
          }
          
          else if ((block->offset + block->length) == block->next->offset) {
           block->length += block->next->length;
           block->next = block->next->next;
          }
         }
         
         else {
          Freeblock * temp1 = fs->freelist;
          
          for (int i = 0; i < count - 1; i++) {
           temp1 = temp1->next;
          }
          
          Freeblock * temp2 = temp1->next;
          temp1->next = block;
          block->next = temp2;
          
          if ((block->offset + block->length) == block->next->offset) {
           block->length += block->next->length;
           block->next = block->next->next;
          }
          
          if ((temp1->offset + temp1->length) == temp1->next->offset) {
           temp1->length += temp1->next->length;
           temp1->next = temp1->next->next;
          }
         }
        }
        return;
}

/* Print the contents of the free list */
void show_freelist(FS *fs) {
 Freeblock * temp = fs->freelist;
 printf("Free List\n");
 
 while (temp != NULL) {
  printf("(offset: %d, length: %d)\n", temp->offset, temp->length);
  temp = temp->next;
 }
 
 return;
}

/* To be used after the metadata has been read from a file, to rebuild the
 * free list.
 */
void rebuild_freelist(FS *fs) {
 Freeblock * result = calloc(1, sizeof(Freeblock));
 result->offset = -1;
 result->length = -1;
 result->next = NULL;
 int real_files = 0;
 
 for (int i = 0; i < MAXFILES; i++) {
  
  if (fs->metadata[i].offset != -1) {
   real_files++;
  }
 }
 Inode files[real_files];
 int j = 0;
 
 for (int k = 0; k < MAXFILES; k++) {
  
  if (fs->metadata[k].offset != -1) {
   files[j] = fs->metadata[k];
   j++;
  }
 }
 int l;
 int m;
 Inode temp;
 
 for (l = 0; l < real_files; l++) {
  
  for (m = l + 1; m < real_files; m++) {
   
   if (files[l].offset > files[m].offset) {
    temp = files[l];
    files[l] = files[m];
    files[m] = temp;
   }
  }
 }
 
 if (files[0].offset != 512) {
  result->offset = 512;
  result->length = files[0].offset - 512;
  
  int n;
  
  for (n = 0; n < real_files - 1; n++) {
   
   if ((files[n].offset + files[n].length) == files[n + 1].offset) {
    continue;
   }
   
   else {
    int offset = files[n].offset + files[n].length;
    int size = files[n + 1].offset - (files[n].offset + files[n].length);
    Freeblock * new_node = calloc(1, sizeof(Freeblock));
    new_node->offset = offset;
    new_node->length = size;
    new_node->next = NULL;
    
    Freeblock * tmp = result;
    
    while (tmp->next != NULL) {
     tmp = tmp->next;
    }
    tmp->next = new_node;
   }
  }
 }
 
 else {
  int p;
  
  for (p = 0; p < real_files - 1; p++) {
   
   if ((files[p].offset + files[p].length) == files[p + 1].offset) {
    continue;
   }
   
   else {
    int offset = files[p].offset + files[p].length;
    int size = files[p + 1].offset - (files[p].offset + files[p].length);
    Freeblock * new_node = calloc(1, sizeof(Freeblock));
    new_node->offset = offset;
    new_node->length = size;
    new_node->next = NULL;
    
    Freeblock * tmp = result;
    
    while (tmp->next != NULL) {
     tmp = tmp->next;
    }
    tmp->next = new_node;
   }
  }
 }
 
 if ((files[real_files - 1].offset + files[real_files - 1].length) != 1536) {
   int offset2 = files[real_files - 1].offset + files[real_files - 1].length;
   int length = 1536 - (files[real_files - 1].offset 
   + files[real_files - 1].length);
   Freeblock * new_node2 = calloc(1, sizeof(Freeblock));
   new_node2->offset = offset2;
   new_node2->length = length;
   new_node2->next = NULL;
   Freeblock * tmp2 = result;
   
   while (tmp2->next != NULL) {
     tmp2 = tmp2->next;
    }
    tmp2->next = new_node2;
  }
  
  if (result->offset == -1) {
   result = result->next;
  }
 fs->freelist = result;
 
 return;
}