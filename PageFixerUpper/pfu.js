/**
 * @fileoverview Disable stupid stuff that sites do (for example, using DIVs
 * and CSS to hide content, which can easily be undone). Instead of having to
 * manually do it every time, have this extension take care of it.
 * @author matt@houglumdev.com (Matt Houglum)
 */

/**
 * @namespace
 */
var pfu = {};

/**
 * Class for each site and what should be done to fix it.  I made this a class
 * in order to allow for adding additional properties in the future.
 * @param {function} fixFn The function to be run when on this site.
 * @constructor
 */
pfu.Site = function(fixFn) {
  this.fix = fixFn;
};

/**
 * Container for all Sites and their specific functions.  As site strings have
 * periods in them, properties should be accessed via bracket notation.
 * @dict
 */
pfu.sites = {};

// IMPORTANT: When adding sites, make sure they're in the manifest under
// content_scripts -> matches and background_scripts -> matches.
/**
 * Site: dayzdb.com
 */
pfu.sites['dayzdb.com'] = new pfu.Site(function() {
  console.log('PFU: Running fix() for dayzdb.com');
  var docLoc = document.location.toString();
  // Make the map page at http://dayzdb.com/map/chernarusplus take up the
  // full width of the page by setting its margin-right to 0 (default is at
  // 301px) and deleting the 'sidebar' DIV.  This is especially helpful when
  // viewing the map on a vertically oriented monitor.
  if (docLoc.indexOf('://dayzdb.com/map/chernarusplus') !== -1) {
    var mapContainerEl = document.getElementById('mapContainer');
    var sideBarEl = document.getElementById('sidebar');
    sideBarEl.remove();
    mapContainerEl.style.marginRight = '0px';
  }
});

// Get the second-level domain, e.g. for "subdomain.herp.derp.com" we get
// "derp.com".
var siteName = document.location.hostname.split('.').slice(-2).join('.');
// If the hostname is a key in our sites object and that Site's not been
// disabled in this extension, call its fix() method.
if (pfu.sites.hasOwnProperty(siteName)) {
  var enabledDict = {};
  enabledDict[siteName] = true;
  chrome.storage.sync.get(enabledDict, function(enabledStatus) {
    if (enabledStatus[siteName] === true) {
      pfu.sites[siteName].fix();
    } else {
      console.log('PFU: ' + siteName + ' disabled.');
    }
  });
}
