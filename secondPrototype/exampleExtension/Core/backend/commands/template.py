# from extensionBase import commandModuleArgs

# TODO: send an interrupt to the all forntends if there are any updates to the notebook.
async def template(moduleArgs:commandModuleArgs): # TODO: write command name
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["mandatory","keys","list"] # TODO: add mandatory key of the command
    missing         = moduleArgs.funcs["dataKeyChecker"](moduleArgs.request["data"],mandatoryKeys)
    if(missing != None):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    

    await moduleArgs.funcs["NotImplementedResponse"](moduleArgs.request,moduleArgs.websocket)