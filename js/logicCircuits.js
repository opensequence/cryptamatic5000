	$().ready(function() {
	    // Retreive URL Hash data

	    var rootUrl = "https://cryptamatic.com"
	    var decryptUrlBits = "#d/"
		var decryptUrlBitsMail = "%23d/"
	    var hashTag = window.location.hash
	    var splitHashTag = hashTag.split('/')
	    var mode = splitHashTag[0]
	    var payload = splitHashTag[1]
	    var clipboard = new Clipboard('.clipboard-btn');
	    //alert(hashTag);
	    //alert(mode);
	    //define functions

	    function EncryptTheStuff() {
	        triplesec.encrypt({

	            data: new triplesec.Buffer($('#text').val()),
	            key: new triplesec.Buffer($('#key').val()),
	            progress_hook: function(obj) {

	            }

	        }, function(err, buff) {

	            if (!err) {
	                var ciphertext = buff.toString('hex');
	                //Create the nice shareable URL
	                var assembleShareLink = rootUrl.concat(decryptUrlBits);
	                var shareLink = assembleShareLink.concat(ciphertext);
					var outputPassword = $('#key').val();
	                $('#text').val(shareLink);
	                //$('#loading').html('ALL DONE!');
	                $('#loading').html('<i class="fa fa-check fa-3x fa-fw" aria-hidden="true"></i>');
					$('#encryption-output-div').show();
	                $('#output-password').html(outputPassword);
					$('#output-title').show();
	                var NatoOptions = {
	                    'decode': $('#key').val(),
	                    'includeCase': true
	                };
	                var phoneticString = $.NatoCallout(NatoOptions);
	                $('#phonetic-key').html(phoneticString)
					var emailAssembleShareLink = rootUrl.concat(decryptUrlBitsMail);
	                var emailShareLink = emailAssembleShareLink.concat(ciphertext);
					var beforeEmailContent = "mailto:?subject=A%20secret%20has%20been%20shared%20with%20you%20via%20cryptamatic.com&body="
					var afterEmailContent = "%0A%0AWhat%20is%20this%20link%3F%0AThe%20URL%20above%20actually%20contains%20the%20encrypted%20data%20-%20no%20data%20is%20stored%20on%20cryptamatic%27s%20servers.%20When%20you%20click%20on%20it%2C%20it%20will%20load%20our%20site%20and%20automaticaly%20auto-fill%20the%20encrypted%20message%20into%20the%20browser%20window.%0A%0AFind%20out%20more%3A%0Ahttps%3A%2F%2Fcryptamatic.com"
					var partAssembledMailLink = beforeEmailContent.concat(emailShareLink);
					var fullAssembledMailLink = partAssembledMailLink.concat(afterEmailContent);
					$('#mailto-button').attr('href',fullAssembledMailLink);

	            } else {
	                alert('hmm that didnt work!');
	                $('#encrypt-button').show();
	                $('#loading').hide();
	            }

	        });
	    }

	    function setRandomPasswordandEncrypt(passwordOptionBool) {
	        if (!$("#AutogenPasswordOptionsBool").prop('checked')) { //if bool is false dont autogen password stuff
	            EncryptTheStuff();
	        } else if (!$("#PasswordOptionsBool").prop('checked')) { //if bool is false dont use random.org seed
	            var my_chance = new Chance();
	            $('#key').val(my_chance.string({
	                length: 15,
	                pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	            }));
	            EncryptTheStuff();
	        } else {
	            var mySeed;
	            $.get("https://www.random.org/integers/", {
	                num: "1",
	                col: "1",
	                min: "1",
	                max: "1000000000",
	                base: "10",
	                format: "plain",
	                rnd: "new"
	            }, function(randNum) {
	                mySeed = randNum;
	                //debugger;
	                // Instantiate Chance with this truly random number as the seed
	                var my_seeded_chance = new Chance(mySeed);
	                $('#key').val(my_seeded_chance.string({
	                    length: 15,
	                    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	                }));
	                EncryptTheStuff();
	            });
	        }
	    }
	    $('#text').focus();
	    //$('#text').html('Type your secret here');
	    $('#encrypt-button').on('click', function() {

	        //	        if ( $(this).parsley().isValid() ) {
	        //fill in the key section with a random key created by the Chance library (and Random.org)
	        setRandomPasswordandEncrypt();

	        //function call back (to make sure that the get succeeds before trying to encrypt

	        $('#encrypt-button, #loading').hide();
	        $('#text').height('160px');
	        $('#loading').show();
			$('#OptionsModalLink').hide();

	        // Start encryption

	        //	        }
	    });
	    //DECRYPTING THE STUFF
	    $('#decrypt-button').on('click', function() {
	        $('#decrypt-button, #loading').hide();
	        $('#text').height('160px');
	        $('#loading').show();
	        triplesec.decrypt({

	            data: new triplesec.Buffer($('#text').val(), "hex"),
	            key: new triplesec.Buffer($('#key').val()),
	            progress_hook: function(obj) { /* ... */ }

	        }, function(err, buff) {

	            if (!err) {
	                $('#text').val(buff.toString());
	                $('#loading').html('<i class="fa fa-check fa-3x fa-fw" aria-hidden="true"></i>');
					$('#clipboarddecrypted').show();
	                $('#password-row').hide();
					
	            } else {
	                alert('Your message could not be decrypted. Check your password.');
	                $('#decrypt-button').show();
	                $('#loading').hide();
	            }

	        });
	    });
	    //Show Encrypt Button if someone click the decrypt link (TBA)

	    $('#encrypt-view').on('click', function() {
	        $('#decrypt-button-div').hide();
	        $('#encrypt-button-div').show();
	        $('#encrypt-view').hide();
	        $('#decrypt-view').show();
	        $('#OptionsModalLink').show();
	        var a = document.getElementById("key");
	        a.value = a.defaultValue;
	    });

	    //Show Decrypt Button if someone click the decrypt link (TBA)

	    $('#decrypt-view').on('click', function() {
	        $('#decrypt-button-div').show();
	        $('#encrypt-button-div').hide()
	        $('#encrypt-view').show();
	        $('#decrypt-view').hide();
	        $('#OptionsModalLink').hide();
	        $('#key').show();
	        var a = document.getElementById("key");
	        a.value = a.defaultValue;
	    });
	    //Show Decrypt Button if #d exist
	    if (mode.includes('#d')) {
	        $('#text').html(payload);
	        $('#decrypt-button-div').show();
	        $('#encrypt-button-div').hide();
	        $('#encrypt-view').show();
	        $('#key').show();
	        $('#OptionsModalLink').hide();
	    } else {
	        $('#decrypt-button-div').hide();
	        $('#encrypt-button-div').show();
	        $('#decrypt-view').show();

	    }

	    //Show password field if option checked
	    $('#AutogenPasswordOptionsBool').change(function() {
	        if (!$("#AutogenPasswordOptionsBool").prop('checked')) { //if bool is false dont autogen password stuff
	            $('#key').show();
	        } else {
	            $('#key').hide();
	        }
	    });
	});