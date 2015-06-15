#target photoshop
app.bringToFront();
main();

//-- main function --
function main()
{
    // -- data -- (should this be outside of this function?)
    
    //general prefix
    var prefix = "tex_";
    
    //outputs & data
    var Outputs = [
    {name:"QFHD", suffix:"@4x", scalefactor:1, active:false}, //this is not real @4x
    {name:"Retina", suffix:"@2x", scalefactor:0.711, active:true},
    {name:"SD", suffix:"", scalefactor:0.355, active:true},]
    
    //unused for the moment
    var UseRelativePath = false;
    var path = "D:\\ROOT\\DUMP\\temp\\dump";
    
    // -- code starts here --
    
    //get filename. If canceled -> abort
    var fileName = prompt ("Enter the filename", "texture", "FileName");    
    if(fileName == null || fileName == "")
        return;
        
    //get original document and create the flattened image
    var originalDocument = app.activeDocument;
    var workingLayer = getWorkingLayer(originalDocument);
    workingLayer.name = "temporary Layer";
    originalDocument.activeLayer = workingLayer;
    
    //set save options
    var saveOptions = new ExportOptionsSaveForWeb();
    saveOptions.format = SaveDocumentType.PNG;
    saveOptions.PNG8 = false;
    
    //generate each output
    for(var i = 0; i < Outputs.length; ++i)
    {
        if(Outputs[i].active)
        {
            //create new document
            Outputs[i].doc = createDocumentForLayer (workingLayer, prefix+fileName+Outputs[i].suffix);
            //copy layer to document
            addLayerToDocument(workingLayer, Outputs[i].doc);
            //resize 
            resizeDocument(Outputs[i].doc, Outputs[i].scalefactor);
            //set current document as active to save and close
            app.activeDocument = Outputs[i].doc;

            var savePath = originalDocument.path;
            
            if(UseRelativePath)
            {
                savePath += path;
            }
            else
            {
                savePath  = File( path );
            }
            
            Outputs[i].doc.exportDocument(savePath,ExportType.SAVEFORWEB, saveOptions);
            Outputs[i].doc.close(SaveOptions.DONOTSAVECHANGES);
        }
     }     
    
    //set original file as active and remove the flattened image
    app.activeDocument = originalDocument;
    workingLayer.remove();
}
// -- helper functions --
function getWorkingLayer(document) //duplicate selected layer(s) and merge down to one
{
    var selectedLayers = getSelectedLayers();
    var workingLayerSet = document.layerSets.add();
    workingLayerSet.name = "working folder";
    
   for(var i = 0; i < selectedLayers.length; ++i)
    {
        if(selectedLayers[i].artLayers == undefined) //layer
        {
            selectedLayers[i].duplicate().move(workingLayerSet, ElementPlacement.INSIDE);
        }
        else //layergroup
        {
            selectedLayers[i].duplicate().merge().move(workingLayerSet, ElementPlacement.INSIDE);
        }
    }
     
    var workingLayer = workingLayerSet.merge();
    workingLayer.name = "working layer";
    
    return workingLayer;
}
function createDocumentForLayer(layer, name)
{
    var width = layer.bounds[2] - layer.bounds[0];
    var height = layer.bounds[3] - layer.bounds[1];

    return app.documents.add (width, height, layer.parent.resolution, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
}
function addLayerToDocument(layer, document)
{
    app.activeDocument = layer.parent;
    var newLayer = layer.duplicate (document, ElementPlacement.PLACEATEND);
    app.activeDocument = document;
    newLayer.translate (-newLayer.bounds[0], -newLayer.bounds[1]);
    
    return newLayer;
}
function resizeDocument(document, value)
{
    app.activeDocument = document;
    document.resizeImage(document.width * value, document.height * value, document.resolution, ResampleMethod.BICUBICSHARPER);
}
function getSelectedLayers() //took this from the internet. thx random dude
{  
    var layerArray = new Array;  
    var desc = new ActionDescriptor();  
    var ref = new ActionReference();  
    ref.putClass( stringIDToTypeID('layerSection') );  
    desc.putReference( charIDToTypeID('null'), ref );  
    var layerRef = new ActionReference();  
    layerRef.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );  
    desc.putReference( charIDToTypeID('From'), layerRef );  
    executeAction( charIDToTypeID('Mk  '), desc, DialogModes.NO );  
    var tempLayerSet = app.activeDocument.activeLayer.layers;  
    for ( var layerIndex = 0; layerIndex < tempLayerSet.length; layerIndex++ ) 
    {  
        layerArray.push( tempLayerSet[layerIndex] );  
    }  
    executeAction( charIDToTypeID('undo'), undefined, DialogModes.NO );  
    return layerArray;  
};  
