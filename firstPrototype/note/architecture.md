# architecture
 This page describe architecture of this notetaking system.

# extentions
## base extentions 
 add basic functions. Here is the examples of these.
- any file preview functions
- ink functions

## extra extentions
 add optional functions.
- synchronize data with cloud services like google drive, onedrive and so on...
- data Importer from other services or apps like onenote, google keep and so on...



# base unit
## Notebook
 contain groups and pages. manage infomation for a project. 
## contents group
 group for organizing any other groups and pages.
## files group
 organaize and manage any binary blob resources. This group automaticly belong to corresponeding pages and groups which use these resources.  

 Here is binary blog resources examples.
- any images
- any videos
- any 3d model files
- any executable files
- any binary files with special data structure.

## duplicate files 
 When files are in the same folder, There are several kind of duplication would be considered.

- different filename but same binary.  
- same filename but different binary.  
- same filename and same binary.  

 To manage these stulations,(tend to be too heavy task, async task)

- compare binary to other resources   
 when find same resources, create reference
- compare filename to other resources.  
 when find whose resources have same filename, add index to filename to identify
 samefinename.cpp
 samefinename-1.cpp
 ...


## page
 page will contain any contents. There are several templates.

- Project flow view (TODO List for each milestone)
- diagram page (like drawio)
- sticky note (like google keep)
- OneNote style page 
- embedded favorite text and code editor view (VScode, neovim, Xcode and etc...) 




