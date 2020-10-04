const fileNameError = '"File name" to parse is required'

module.exports = {
  checkArg: function(processArgv) {
    if(!processArgv[2]) throw new Error(fileNameError);
  }
}