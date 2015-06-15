#target photoshop
app.bringToFront();
main();

//-- main function --
function main()
{
    var doc = app.activeDocument;
    var guides = doc.guides;
        
    if(guides.length <= 0)
        return;
    
    return writeFile (doc, guides);
}

function writeFile (doc, guides)
{
    //pick location
    var file = File.saveDialog (" save file  (╯°□°）╯︵ ┻━┻ ", ".json")
    
    //user cancelled
    if(file == null)
        return false;
    
    //open file for writing
    if(!file.open("w"))
        return false;
    
    if(guides.length <= 0)
        return false;
    
    file.writeln ("{");
    
    file.writeln("\t\"aspectratio\":\"" + (doc.width.value/doc.height.value) + "\",");
    
    file.writeln("\t\"guides\":[");
    for(var i=0; i < guides.length; ++i)
    {
        var guide = guides[i];
        var isHorizontal = (guide.direction == "Direction.HORIZONTAL" ? true : false);
        
        var percentage = isHorizontal ? guide.coordinate.value/doc.height.value : guide.coordinate.value/doc.width.value;

        file.writeln ("\t{\"horizontal\":" + isHorizontal + ", \"percentage\":" + percentage + "}," );
    }
    file.writeln ("\t]");
    file.writeln ("}");
    
    
    file.close();

    return "great success";
}