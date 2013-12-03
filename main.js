(function() {
    // Error checking for the form.
    $('form button').prop('disabled', '');
    function checkValid(form) {
        if (form) {
            $(form).find('button').prop('disabled', !form.checkValidity());
        }
    }
    $(document).on('change keyup paste', 'input, select, textarea', function(e) {
        checkValid(e.target.form);
    });
    $('form').each(function() {
        checkValid(this);
    });

    function escapeText(txt) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(txt));
        return div.innerHTML;
    }

    function stripText(txt) {
        return txt.replace(/\s+/g, ' ').replace(/\s$/g, '');
    }

    var $answer = $('textarea[name=answer]');
    var $button = $('button');
    var $answers = $('.answers');
    var $answersList = $answers.find('ul');

    // Open a connection to firebase.
    var answerRef = new Firebase('https://bantfire.firebaseio.com/answers');

    // Process the form.
    $('form').on('submit', function(evt) {
        evt.preventDefault();
        var newAnswerRef = answerRef.push();

        // Post to firebase.
        newAnswerRef.set({user: '', text: stripText(escapeText($answer.val()))});

        // Clear the textbox.
        $answer.val('').trigger('change');

        // Remove focus from the submit button.
        $button.blur();

        // Remember whether the form was submitted.
        localStorage.submitted = '1';

        // Render the answers.
        $answers.show();
    });

    if (localStorage.submitted) {
        $answers.show();
    }

    // Render answers.
    answerRef.on('value', function(snapshot) {
        console.log('value');
    });

    answerRef.on('child_added', function(snapshot) {
        var name = snapshot.name();
        var val = snapshot.val();
        console.log('child_added', name, val);
        $answersList.prepend('<li data-id="' + name + '">' + val.text + '</li>');
    });

    answerRef.on('child_changed', function(snapshot) {
        var name = snapshot.name();
        var val = snapshot.val();
        console.log('child_changed', name, val);
        $answersList.find('li[data-id="' + name + '"]').text(val.text);
    });

    answerRef.on('child_removed', function(snapshot) {
        var name = snapshot.name();
        var val = snapshot.val();
        console.log('child_removed', name, val);
        $answersList.find('li[data-id="' + name + '"]').remove();
    });
})();
