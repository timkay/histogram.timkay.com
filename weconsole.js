//test test
(function (_log, _clr, _time, _tend) {
    let max = 50;
    let counter = 0;
    let console_log = (...args) => {
        // _log(...args);
        if (counter++ > max) return;
        if (counter > max) args = ['... truncated ...'];
        let console = $('#_webedit_console_content');
        if (!console.length) {
            $('body').append('<div id="_webedit_console" style="position: fixed; z-index: 100; left: 1px; right: 1px; bottom: 1px; max-height: 2in; opacity: 0.33; border: thin dashed gray; overflow-x: auto; padding: 4px;">'
                            + '<button id="_webedit_console_clear" style="position: fixed; bottom: 20px; right: 20px;">clear</button>'
                            + '<pre id="_webedit_console_content" style="margin: 0;"><b>CONSOLE OUTPUT (except some error messages--see browser console.)</b>\n</pre>'
                            + '</div>');
            console = $('#_webedit_console_content');
            $('#_webedit_console_clear').click(event => console_clear());
            $(window).on('error', event => {
                event.preventDefault();
                console_log(event.originalEvent.error.stack.replace(/https?:.*\//, ''));
            });
        }
        console.append(args.map(pretty).join(' ').replace(/</g, '&lt;') + '\n').parent().scrollTop(console.height());
        
        function pretty(item) {
            if (item instanceof Error) return item.toString();
            if (['object'].includes(typeof item)) {
                try {
                    return item.constructor.name + ' ' + JSON.stringify(item);
                } catch (error) {
                    return item.type + ' event' || 'Cannot display: ' + error;
                }
            }
            return item;
        }
    };
    let console_clear = () => {
        _clr();
        counter = 0;
        $('#_webedit_console_content').html('');
    };
    console.log = console_log;
    console.clear = console_clear;
    console.done = () => {
        let console = $('#_webedit_console_content');
        let total = counter;
        counter = 0;
        if (total > max) console_log(`... ${total} lines total ...`);
    };
    let beg = {};
    console.time = (s) => beg[s] = Date.now();
    console.timeEnd = (s) => console_log(`... ${(Date.now() - (beg[s] || Date.now())) / 1000.} sec ...`);
})(console.log, console.clear, console.time, console.timeEnd);
