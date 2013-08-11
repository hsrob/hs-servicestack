var bhvrUtils = (function () {
    var _bhvrUtils = {
        SETTINGS:
        {
            REQUEST_TIMEOUT: 120000
        },
        showErrorAlert: function ($parentContainer, message) {
            console.log('showing error msg: ' + message);
            if ($parentContainer.children('.alert-danger').length) {
                var $alert = $parentContainer.children('.alert-danger');
                $alert.children('.error-message-text').text(message);
            }
            else {
                $parentContainer.prepend('<div class="alert alert-danger"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;<span class="error-message-text">' + message + '</span><button type="button" class="close pull-right" data-dismiss="alert">&times;</button></div>');
            }
        },
        initBehaviorCreateEdit: function() {
            var mobiScrollInst = $("#Behavior_CountIntvl").mobiscroll().time({
                theme: 'android-ics',
                timeFormat: 'HH:ii:ss',
                timeWheels: 'HHiiss',
                mode: 'mixed',
                formatResult: function (data) {
                    //console.log(data);
                    return ((data[0]) < 10 ? "0" + data[0] : data[0]) + ":" + ((data[1]) < 10 ? "0" + data[1] : data[1]) + ":" + ((data[2]) < 10 ? "0" + data[2] : data[2]);
                }
            });
        },
        initClientCreateEdit: function() {
            if ($('select#EmployeeId').length) {
                $('select#EmployeeId').on('change', function () {
                    var $selOpt = $(this).children('option:selected');

                    $('#user-entity-id').val($selOpt.data('user-entity-id'));
                });
            }

            var mobiScrollInst = $("#DateOfBirth").mobiscroll().date({
                dateFormat: 'mm/dd/yy',
                theme: 'android-ics',
                mode: 'mixed',
                showNow: true
            });
        },
        getWarningWrapped: function(message) {
            return '<div class="validation-alert alert alert-danger">'
                + '<span class="glyphicon glyphicon-warning-sign"></span>&nbsp;&nbsp;'
                + message
                + '<button type="button" data-role="none" class="close" data-dismiss="alert">&times;</button>'
                + '</div>';
        },
        getValidationInputAddon: function() {
            return '<span class="input-group-addon"><span class="glyphicon glyphicon-warning-sign"></span></span>';
        },
        selectFromList: function ($link) {
            var self = this;
            $.ajax({
                url: $link.prop('href'),
                type: "POST",
                timeout: 5000,
                success: function (data) {
                    if (data.Url.length) {
                        window.location.href = data.Url;
                    }
                },
                error: function (jqXHR, status, error) {
                    console.log(jqXHR, status, error);
                    $('.flash-messages .validation-alert').remove();
                    $('.flash-messages').prepend(self.getWarningWrapped('Sorry, there was an error performing this action, please try again or contact ' +
                'your administrator if you believe this is a bug.'));
                }
            });
        }
    };
    return _bhvrUtils;
})();