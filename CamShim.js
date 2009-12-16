
function CamShim(displayTargetID, showFrameCallback, camOptions) {

    var flashvars = {
        showFrameCallback: showFrameCallback,
    };
    
    for (property in camOptions) {
        flashvars[property] = camOptions[property];
    }
    
    swfobject.embedSWF("cam.swf", displayTargetID, "320", "150", "9.0.0","expressInstall.swf", flashvars);
    
    var isReady = function() {
        return true;
    }
}


function CamOptions() {
    /**
     * Camera resolution, width.
     * resolutionX, resolutionY and framesPerSecond together determine performance - lower number mean better performance.
     *
     * Default = 160
     *
     */
    this.resolutionX = 160;

    /**
     * Camera resolution, height.
     * resolutionX, resolutionY and framesPerSecond together determine performance - lower number mean better performance.
     *
     * Default = 120
     */
    this.resolutionY = 120;

    /**
     * Frames per second to be copied from Flash to HTML/JS.
     * This is just a target, and is not guaranteed.
     * resolutionX, resolutionY and framesPerSecond together determine performance - lower number mean better performance.
     *
     * Default = 20 fps
     */
    this.framesPerSecond = 20;
    
    /**
     * Should we continue to display the video after the user permission dialog is accepted?
     *
     * Default = "true"
     */
    this.displayVideo = "true";
    
    /**
     * Javascript function to call when the camera status changes.
     * This method will be passed "ENABLED" if the user give the camera permissions
     * and "DISABLED" if they do not
     *
     * Default = null
     *
     */
    this.camStatusCallbackFunction = null;
    
    /**
     * Called with "true" if motion occurs, "false" if it has stopped
     */
    this.motionDetectionCallbackFunction = null;
    
    
    /**
     * Should the video be mirrors (reversed) in Flash?
     *
     * Default = false
     */
    this.mirrorVideo = "false";
    
    /**
     * Debugging and message function
     */
    this.messageCallbackFunction = null;
    
}
