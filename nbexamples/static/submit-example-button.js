define(['jquery', 'base/js/namespace', 'base/js/utils'], function ($, Jupyter, utils) {

    function submit_example () {
        var url = utils.get_body_data("baseUrl") + '/examples/submit?example_id=' + Jupyter.notebook.notebook_path;
        var win = window.open(url, '_blank');
        win.focus();
    };
    
    function add_button () {
        if (!Jupyter.toolbar) {
            $([Jupyter.events]).on("app_initialized.NotebookApp", add_button);
            return;
        }

        if ($("#submit-example-button").length === 0) {
            Jupyter.toolbar.add_buttons_group([{
              'label'   : 'Share as Example',
              'icon'    : 'fa-send',
              'callback': submit_example,
              'id'      : 'submit-example-button'
            }]);
        }
    };

    return {
        load_ipython_extension : add_button,
    };

    Jupyter.toolbar.add_buttons_group([{
      'label'   : 'Share as Example',
      'icon'    : 'fa-send',
      'callback': submit_example,
      'id'      : 'submit-example-button'
    }]);
});
