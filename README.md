
# Enhanced Export Tracking Data Script for After Effects

This script exports detailed tracking data from Adobe After Effects to JSON, including advanced properties like skew, rotation, and effects. Use it to integrate After Effects data into external applications.


## Steps to Export Tracking Data:

1. Download and Save the Script:

Save the enhancedExportTrackingData.jsx script to your computer.



2. Prepare Your AE File:

Open the AE file you mentioned in Adobe After Effects.



3. Run the Script:

Go to File > Scripts > Run Script File... in After Effects.

Select the enhancedExportTrackingData.jsx file.



4. Base64 Encode the Data:

Modify the script to include base64 encoding for any binary or text data exported. For example:
```
function toBase64(input) {
    return $.evalFile($.fileName.replace(/[^\\/]+$/, "base64_encode.jsx")).encode(input);
}
```
Use the above function to encode specific data fields before exporting to JSON.



5. Save the JSON:

The script will prompt you to choose a location to save the JSON file.



6. Verify the Output:

Open the JSON file to confirm the tracking data and base64 strings are included.