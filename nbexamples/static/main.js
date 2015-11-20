define(function(require) {
    var $ = require('jquery');
    var Jupyter = require('base/js/namespace');
    var Examples = require('./examples');

    var examples_html = $([
        '<div id="examples" class="tab-pane">',
        '  <div id="examples_toolbar" class="row list_toolbar">',
        '    <div class="col-sm-8 no-padding">',
        '      <span id="examples_list_info" class="toolbar_info">A shared collection of notebooks. To contribute a new notebook</span>',
        '    </div>',
        '    <div class="col-sm-4 no-padding tree-buttons">',
        '      <span id="examples_buttons" class="pull-right toolbar_buttons">',
        '      <button id="refresh_examples_list" title="Refresh examples list" class="btn btn-default btn-xs"><i class="fa fa-refresh"></i></button>',
        '      </span>',
        '    </div>',
        '  </div>',
        '  <div class="panel-group">',
        '    <div class="panel panel-default">',
        '      <div class="panel-heading">',
        '        Curated, Reviewed Examples',
        '      </div>',
        '      <div class="panel-body">',
        '        <div id="reviewed_examples_list" class="list_container">',
        '          <div id="reviewed_examples_list_placeholder" class="row list_placeholder">',
        '            <div> There are no examples to fetch. </div>',
        '          </div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '    <div class="panel panel-default">',
        '      <div class="panel-heading">',
        '        Staged Examples Still Under Review',
        '      </div>',
        '      <div class="panel-body">',
        '        <div id="unreviewed_examples_list" class="list_container">',
        '          <div id="unreviewed_examples_list_placeholder" class="row list_placeholder">',
        '            <div> There are no unreviewed examples. </div>',
        '          </div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>   ',
        '</div>',
        '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">',
        '  <div class="modal-dialog" role="document">',
        '      <div class="modal-content">',
        '      <div class="modal-header">',
        '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
        '          <h4 class="modal-title" id="myModalLabel">Modal title</h4>',
        '      </div>',
        '        <form action="examples/fetch" method="get" target="_blank">',
        '          <div class="modal-body">',
        '            <input type="text" name="dest" ><br><input type="hidden" name="example_id" value="prediction.ipynb">',
        '          </div>',
        '          <div class="modal-footer">',
        '            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>',
        '            <input type="submit" class="btn btn-primary">Save changes</button>',
        '          </div>',
        '        </form>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">',
        '  Launch demo modal',
        '</button>',
    ].join('\n'));

   function load() {
        if (!Jupyter.notebook_list) return;
        var base_url = Jupyter.notebook_list.base_url;
        $('head').append(
            $('<link>')
            .attr('rel', 'stylesheet')
            .attr('type', 'text/css')
            .attr('href', base_url + 'nbextensions/nbexamples/examples.css')
        );
        $(".tab-content").append(examples_html);
        $("#tabs").append(
            $('<li>')
            .append(
                $('<a>')
                .attr('href', '#examples')
                .attr('data-toggle', 'tab')
                .text('Examples')
                .click(function (e) {
                    window.history.pushState(null, null, '#examples');
                })
            )
        );
        var examples = new Examples.Examples(
            '#reviewed_examples_list',
            '#unreviewed_examples_list',
            {
                base_url: Jupyter.notebook_list.base_url,
                notebook_path: Jupyter.notebook_list.notebook_path,
            }
        );
        examples.load_list();
    }
    return {
        load_ipython_extension: load
    };
});
