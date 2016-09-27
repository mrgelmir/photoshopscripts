#target photoshop
app.bringToFront();
main();

//-- main function --
function main()
{     
    
     // Data
    var Outputs = [
        // iOS
        {name:"QFHD", extraPath:"\\ios", prefix:"bot_large_", suffix:"@3x", scalefactor:0.75, active:true},
        {name:"Retina", extraPath:"\\ios", prefix:"bot_large_", suffix:"@2x", scalefactor:0.5, active:true},
        {name:"SD", extraPath:"\\ios", prefix:"bot_large_", suffix:"", scalefactor:0.25, active:true},
        // Android
        {name:"xxxhdpi", extraPath:"\\android\\drawable-xxxhdpi", prefix:"bot_large_", suffix:"", scalefactor:1, active:true},
        {name:"xxhdpi", extraPath:"\\android\\drawable-xxhdpi", prefix:"bot_large_", suffix:"", scalefactor:0.75, active:true},
        {name:"xhdpi", extraPath:"\\android\\drawable-xhdpi", prefix:"bot_large_", suffix:"", scalefactor:0.5, active:true},
        {name:"hdpi", extraPath:"\\android\\drawable-hdpi", prefix:"bot_large_", suffix:"", scalefactor:0.425, active:true},
        {name:"mdpi", extraPath:"\\android\\drawable-mdpi", prefix:"bot_large_", suffix:"", scalefactor:0.25, active:true},

        // iOS
        {name:"QFHD", extraPath:"\\ios", prefix:"bot_medium_", suffix:"@3x", scalefactor:0.45, active:true},
        {name:"Retina", extraPath:"\\ios", prefix:"bot_medium_", suffix:"@2x", scalefactor:0.3, active:true},
        {name:"SD", extraPath:"\\ios", prefix:"bot_medium_", suffix:"", scalefactor:0.15, active:true},
        // Android
        {name:"xxxhdpi", extraPath:"\\android\\drawable-xxxhdpi", prefix:"bot_medium_", suffix:"", scalefactor:.6, active:true},
        {name:"xxhdpi", extraPath:"\\android\\drawable-xxhdpi", prefix:"bot_medium_", suffix:"", scalefactor:0.45, active:true},
        {name:"xhdpi", extraPath:"\\android\\drawable-xhdpi", prefix:"bot_medium_", suffix:"", scalefactor:0.3, active:true},
        {name:"hdpi", extraPath:"\\android\\drawable-hdpi", prefix:"bot_medium_", suffix:"", scalefactor:0.255, active:true},
        {name:"mdpi", extraPath:"\\android\\drawable-mdpi", prefix:"bot_medium_", suffix:"", scalefactor:0.15, active:true},
    ]
    
    // -- code starts here --

    // set the output folder
    //var outputFolder = Folder.selectDialog("Select a folder for the output files");
    var outputFolder = activeDocument.path;
    
    if(outputFolder == null)
        return;
    
    // Set save options
    var exportOptions = new ExportOptionsSaveForWeb();
    exportOptions.format = SaveDocumentType.PNG;
    exportOptions.PNG8 = false;
    exportOptions.transparency = true;    
    exportOptions.interlaced = 0;
    exportOptions.includeProfile = false;
    exportOptions.optimized = true;
    
    // Get layer count
    var layerCount = activeDocument.layers.length;
    
    // Store the original visibility properties of the layers so we can set them back when done
    // Then set all layer visibility to false
    var originalVisibility = new Array();
    for(var i = 0; i < layerCount; i++) {
        originalVisibility[i] = activeDocument.layers[i].visible;
        activeDocument.layers[i].visible = false;
    }

    // Loop through all layers
    for (var i = 0; i < layerCount; i++) {
        var layer = activeDocument.layers[i];
        if (layer.typename == 'LayerSet'){
            //skip layer groups or add prefix?
        }
        else {
            
            // Everything is invisible now, so show
            layer.visible = true;
            
            // Export for all configurations
            for(var y = 0; y < Outputs.length; ++y)
            {                     
                if(!Outputs[y].active)
                    continue;
                
                // create save path and directory
                var fileName = layer.name.replace(/\s+/g, '_').replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
                var localFolder = Folder(outputFolder + "\\" + Outputs[y].extraPath);           
                var savePath =  File(localFolder + "\\" + Outputs[y].prefix + fileName + Outputs[y].suffix + ".png");       
                               
                // Check if directory exists -> create if needed
                verifyFolder(localFolder);
                
                // Create and scale temp doc      
                var tempFile = app.activeDocument.duplicate();
                resizeDocument(tempFile, Outputs[y].scalefactor);
                
                // Export current doc and discard
                tempFile.exportDocument(savePath, ExportType.SAVEFORWEB, exportOptions);
                tempFile.close(SaveOptions.DONOTSAVECHANGES);
            }
            
            // Re-hide layer
            layer.visible = false;            
        }
    }
       
    // Restore layer visibility
    for(var i = 0; i < layerCount; i++) {
        activeDocument.layers[i].visible= originalVisibility[i] ;
    }
    
    alert("Finished");
}

function resizeDocument(document, value)
{
    app.activeDocument = document;
    document.resizeImage(document.width * value, document.height * value, document.resolution, ResampleMethod.BICUBICSHARPER);
}

function verifyFolder(folder) {
 //-------------------------------------------------------------------------
 //-- V E R I F Y
 //-------------------------------------------------------------------------
 //-- Generic: Yes
 //-------------------------------------------------------------------------
 //-- Purpose: A folder object method to verify if the folder specified
 //--  actually exists. If the folder doesn't exist, the method will
 //--  attempt to create it.
 //-------------------------------------------------------------------------
 //-- Returns: True if the folder exists, false if it couldn't create it.
 //-------------------------------------------------------------------------
 //-- Sample Call:
 //--  Folder ( '~/IsItHere' ).verify() ;
 //-------------------------------------------------------------------------
 //-- Calls: Nothing
 //-------------------------------------------------------------------------
 //-- Written 2009.09.19 on board US Airways flight 4376.
 //-- eps@electronicpublishingsupport.com
 //------------------------------------------------------------------------- 
 
 if ( folder.exists ) {
  return true ;
 }
 else {
  //-- Create an array like a stack of folders that will need
  //--  to be created.
  var foldersToCreate = new Array () ;
  //-- Create a local copy of the original folder
  //--  because it needs to be modified within
  //--  this routine.
  //--  Using the absoluteURI version of the name to point
  //--   all the way through to the sever. Only this version
  //--   of the activeFolder needs to use this absoluteURI
  //--   notation because.
  var activeFolder = new Folder (folder.absoluteURI ) ;

  //-- Loop through the path structure until every part of
  //--  of the folder path is checked. Any non-existanet
  //--  folder path will be added to the array to create.
  while ( ! activeFolder.exists ) {
   //-- Add the activeFolder to the array of folders to create
   foldersToCreate.push( activeFolder ) ;
   //-- Now get to the parent of the folder.
   //--  Can't use .parent because if the active folder
   //--   doesn't exist, it won't have a parent.
   activeFolder = new Folder ( activeFolder.path ) ;
  }
  //-- At this point we have an array of folders that need to be
  //--  created. The array will have one element too many because
  //--  of the final line of the
  while ( foldersToCreate.length > 0 ) {
   //-- Remove the last item added to the array of folders to create
   activeFolder = foldersToCreate.pop() ;
   //-- Try to create this folder
   if ( ! activeFolder.create() ) {
    return false ;
   } //-- end of if create
  } //-- end of lower while
 } //-- end of else from way up top
 //-- At this point the folder has to exist else we already returned false
 return true ;
}
