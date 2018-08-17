/* VMware vRealize Orchestrator (vRO) action sample

    Returns the vCenter VM for a VM UUID in all vCenters
 
    For vRO/vRA 7.0+

    Action Inputs:
        uuid  - string

    Return type: VC:VirtualMachine
*/

//Get all sdk connections
var sdkConnections = VcPlugin.allSdkConnections;
System.debug(sdkConnections.length + "  sdk connections found ...");

//Run through all sdk conntections to find VM
for each (var sdkConnection in sdkConnections) {
	System.debug ("sdkConnection : " + sdkConnection.name);
	try {
		var vm= sdkConnection.SearchIndex.findByUuid(null,uuid,true,true);
	} catch (e) {
		//error during search
		System.error("Error for SDK connection " + sdkConnection.name + ":" + e);
	}
	if (vm != null){
		//VM is found so exit loop and return VM
		System.debug("Resolved vCenter VM " + vm.name);
	    return vm;
		break;
	} else {
		// VM not found in this sdkConnection
		System.log ("VM not found in " + sdkConnection.name);
	}
}
//no VM found at all
throw System.error("VM not found.");