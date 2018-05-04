/**
 * A persistant object class using localStorage
 * 
 * Copyright Oliver Caldwell 2011 (olivercaldwell.co.uk)
 * http://olivercaldwell.co.uk/?p=89
 */
function PersistantObject(key) {
	// Store the key
	this.setKey(key);
	
	// Initialise the data as an empty object
	this.data = {};
	
	// Load the data
	this.load();
}

/**
 * Sets the key for the instance
 * 
 * @param {String} key Name to set the key to
 */
PersistantObject.prototype.setKey = function(key) {
	this.key = key;
};

/**
 * Loads the JSON from localStorage from the key and decodes it
 */
PersistantObject.prototype.load = function() {
	// Load the value
	var value = localStorage.getItem(this.key);
	
	// If it exists then decode it and store the result
	if(value) {
		this.data = JSON.parse(value);
	}
};

/**
 * Deletes the value from localStorage
 */
PersistantObject.prototype.erase = function() {
	// Delete the value
	localStorage.removeItem(this.key);
};

/**
 * Save the object back into localStorage
 */
PersistantObject.prototype.save = function() {
	// Save the JSON encoded value
	localStorage.setItem(this.key, JSON.stringify(this.data));
};

export function PersistantObject();