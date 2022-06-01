initializeNeos();

// initial camera position that is too close for worlds and too far for items
neos.camera.position.z = 5;
neos.camera.position.y = 5;
neos.camera.rotation.x = -0.78;

// spins the root of the world constantly
function mainLoop() {
	requestAnimationFrame(mainLoop);
	neos.scene.rotation.y += 0.01;
}
mainLoop();


// loading an object from file
document.getElementById("loadBtn").addEventListener("click", function() {
	let reader = new FileReader();
	reader.onload = function(e) {
		neos.loadObject(JSON.parse(e.target.result), neos.rootSlot);
		console.log("The following components could not be found:");
		console.log(unknownComponents);
	};
	reader.readAsText(document.getElementById("filePicker").files[0]);
});

// recursively returns nested ul elements to make up a pseudo-inspector
function generateSlotInspector(slot) {
	let inspector = document.createElement("ul");
	inspector.appendChild(document.createTextNode(slot.userData.Fields.Name.Data + " (" + slot.userData.ID + ")"));
	slot.userData.Children.forEach(child => {
		inspector.appendChild(generateSlotInspector(child));
	});
	
	return inspector;
}

document.getElementById("inspectorBtn").addEventListener("click", function() {
	// delete old inspector
	if (document.getElementById("inspector")) {
		document.getElementById("inspector").remove();
	}
	
	// generate new inspector
	let newInspector = generateSlotInspector(neos.rootSlot);
	newInspector.id = "inspector";
	document.body.appendChild(newInspector);
});

// loading an object from the NeosDB
document.getElementById("loadLinkBtn").addEventListener("click", function() {
	if (neosLinkInput.value.startsWith("neosdb:///")) {
		linkID = neosLinkInput.value.substring(10, neosLinkInput.value.indexOf("."));
		// instead of the regular neosDB, we get the item from decompress.kokoa.dev so we don't need to handle the decompression in the browser.
		fetch("https://decompress.kokoa.dev/?id=" + linkID)
		.then(response => response.json())
		.then(data => {
			neos.loadObject(data, neos.rootSlot);
			console.log("The following components could not be found:");
			console.log(unknownComponents);
		});
	}
});