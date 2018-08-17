/* VMware vRealize Orchestrator (vRO) action

    Returns the UUID of a vCenter VM for a Catalog Item Request

    for vRO/vRA 7.0+

    Action inputs:
      vCAChost - vCACCAFE:VCACHost
      catalogItemRequest - vCACCAFE:CatalogItemRequest

     Return type: string
*/

//Request data from vRA
var client = vCAChost.createCatalogClient();
var response = client.get("/consumer/requests/" + catalogItemRequest.id + "/resources").getBodyAsJson();
var resources = new Array();

// find moRef, ipAddress and UUID
for(var x in response.content){
    var resource = response.content[x];
    if(resource.resourceTypeRef.id == "Infrastructure.Virtual") {
        resources.push(vCACCAFEEntitiesFinder.getCatalogResource(vCAChost, resource.id));
        var ipAddress = "";
		var uuid = "";
        for(var k in resource.resourceData.entries) {
            var property = resource.resourceData.entries[k];
			switch (property.key) {
				case "EXTERNAL_REFERENCE_ID":
					moRef = property.value.value;
					break;
				case "ip_address":
					ipAddress = property.value.value;
					break;
				case "VirtualMachine.Admin.UUID":
					uuid = property.value.value;
					break;
			}
        }
        System.debug("vmName : " + resource.name + " - " + resource.id + " ; moRef = " + moRef + " ; ipAddress = " + ipAddress + " ; UUID : " + uuid);
    }
}
if (uuid == "") { 
    // No UUID found.
		throw System.error("No VM UUID found for CatalogItemRequest no: "+ catalogItemRequest.requestNumber +.");
    }
//Return the UUID
return uuid;