// Get the module
// Create a client.
// Create a fake message
// For each greeting in greetings.txt.
//  Set the messsage content.
//  Call the module.

var client, message;

const AUTHOR = 0;

class Client {
	get user() {
		return null;
	}
};

class Channel {
	_checked;
	_requiring;
	
	setRequiring(data) {
		_checked = false
		_requiring = data;
	}
	
	get wasChecked() {
		return _checked;
	}
	
	send(data) {
		assert.equal(data, _requiring);
		_checked = true;
	}
};

class Message {
	static _author = {id: AUTHOR};
	static _channel = new Channel();
	_content;
	
	isMentioned(user) {
		return true;
	}
	
	get author() {
		return _author;
	}
	
	get channel() {
		return _channel;
	}
	
	get content() {
		return _content;
	}
	
	set content(value) {
		_content = value;
	}
};

describe("greeting", () => {
	client = new Client();
	message = new Message();
	
	// Unfinished test.
	// Use the greeting.txt file that contains key, value pairs of greetings and responses.
	// When calling the greeting module with the key, it must equal the associated value.
});
