// Smart Export Tracking Data from After Effects to JSON
(function smartExportTrackingData() {
    // Check if there's an active composition
    var activeComp = app.project.activeItem;

    if (!(activeComp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    // Define utility functions
    function extractKeyframes(prop) {
        var keyframes = [];
        if (prop.numKeys > 0) {
            for (var k = 1; k <= prop.numKeys; k++) {
                keyframes.push({
                    time: prop.keyTime(k),
                    value: prop.keyValue(k),
                    interpolation: {
                        inType: prop.keyInInterpolationType(k),
                        outType: prop.keyOutInterpolationType(k)
                    }
                });
            }
        }
        return keyframes;
    }

    function extractLayerData(layer) {
        var layerData = {
            name: layer.name,
            type: layer instanceof AVLayer ? "AVLayer" : layer instanceof TextLayer ? "TextLayer" : "Other",
            properties: {}
        };

        // Transform Group
        if (layer.property("ADBE Transform Group")) {
            var transform = layer.property("ADBE Transform Group");
            layerData.properties.position = extractKeyframes(transform.property("ADBE Position"));
            layerData.properties.rotation = extractKeyframes(transform.property("ADBE Rotate Z"));
            layerData.properties.scale = extractKeyframes(transform.property("ADBE Scale"));
            layerData.properties.skew = extractKeyframes(transform.property("ADBE Skew"));
            layerData.properties.skewAxis = extractKeyframes(transform.property("ADBE Skew Axis"));
        }

        // Effects
        if (layer.property("ADBE Effect Parade")) {
            var effects = layer.property("ADBE Effect Parade");
            for (var e = 1; e <= effects.numProperties; e++) {
                var effect = effects.property(e);
                layerData.properties[effect.name] = {};
                for (var ep = 1; ep <= effect.numProperties; ep++) {
                    var effectProp = effect.property(ep);
                    layerData.properties[effect.name][effectProp.name] = extractKeyframes(effectProp);
                }
            }
        }

        return layerData;
    }

    // Collect data
    var data = {
        compName: activeComp.name,
        frameRate: activeComp.frameRate,
        duration: activeComp.duration,
        width: activeComp.width,
        height: activeComp.height,
        layers: []
    };

    app.beginUndoGroup("Smart Export Tracking Data");

    for (var i = 1; i <= activeComp.numLayers; i++) {
        var layer = activeComp.layer(i);
        data.layers.push(extractLayerData(layer));
    }

    // Save JSON
    var jsonString = JSON.stringify(data, null, 4);
    var file = File.saveDialog("Save Tracking Data", "JSON Files:*.json");
    if (file) {
        file.open("w");
        file.write(jsonString);
        file.close();
        alert("Tracking data exported successfully!");
    } else {
        alert("Export canceled.");
    }

    app.endUndoGroup();
})();
