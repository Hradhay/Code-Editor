//=============== UTILITIES ====================

const $ = s => document.querySelector(s);
const $$ = s =>  Array.from(document.querySelectorAll(s));  /* this 2 const, the 1st is used to select a single element 
                                                              or a class or id etc but the 2nd const is used to select 
                                                                from whole list*/
const out = $("#output");
const preview = $("#preview");
const STORAGE_KEY = "Editor-local-storage";

const escapeHtml = s =>                      /* Replacing the the below regular expresstion to its corroseponding & 
                                                also elements or such will be replace in to string thtought this method*/ 
            String(s).replace(/[&<>"]/g, c =>  ({  
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&quot;'
      }[c]                                    // requires the index on c
    ));


    function log(msg , type='info'){
            const color = type === 'error' ? 'var(--err)' : type === 'warn' ? 'var(--warn)' : 'var(--brand)';
            
            const time = new Date().toLocaleDateString();
            const line = document.createElement('div');

            line.innerHTML = `<span style = "color : ${color}">[${time}]</span> ${escapeHtml(msg)}`;
            
            out.appendChild(line);
            out.scrollTop = out.scrollHeight;
    }


    function clearOut(){

        out.innerHTML = '';

    }

    $("#clearOut")?.addEventListener('click',clearOut);

    function makeEditor(id , mode){
        const ed = ace.edit(id , {
            theme : 'ace/theme/dracula',
            mode, 
            tabSize: 2,
            useSoftTabs: true,
            showPrintMargin: false,
            wrap: true
        });
        ed.session.setUseWrapMode(true);

        ed.commands.addCommand({
            name : 'run',
            bindKey :{ 
                wind: 'Ctrl-Enter',
                mac: 'Command-Enter'
            },
            exec(){  runWeb(false);     }
        });

        ed.commands.addCommand({
            name: 'save',
            bindKey: {
                wind: 'Ctrl-S',
                mac: 'Command-S'
            },
            exec(){   saveproject();      }
        });

        return ed;
    } 

    const ed_html = makeEditor('ed_html','ace/mode/html');
    const ed_css = makeEditor('ed_css','ace/mode/css');
    const ed_js = makeEditor('ed_js','ace/mode/javascript');

    const TAB_ORDER = ['html', 'css', 'js'];

    const wraps = Object.fromEntries(
        $$('#webEditors .editor-wrap').map(w => [w.dataset.pane,w]));

    const editors = {
        html : ed_html,
        css: ed_css,
        js: ed_js
    };

    function activePane(){ 
        const t = $('#webTabs .tab.active'); // return the tab which is active that is the use of this fun.
        return t ? t.dataset.pane : 'html';
    }

    function showPane(name){ 
        TAB_ORDER.forEach(k => {
            if (wraps[k]){
                 wraps[k].hidden = (k !== name);
            }
        });
        $$('#webTabs .tab').forEach(t => { 
            const on = t.dataset.pane === name;
            t.classList.toggle('active', on );
            t.setAttribute('aria-selected', on);
            t.tabIndex = on ? 0 : -1;
        });

        requestAnimationFrame(() => {
            const ed = editors[name];
            if (ed && ed.resize){
                ed.resize(true);
                ed.focus();
            }
        });
    }

    $('#webTabs')?.addEventListener('click', (e) => { 
        const btn = e.target.closest('.tab');
        if(!btn){
            return;
        }
        showPane(btn.dataset.pane);
    })
$('#webTabs')?.addEventListener('keydown', (e) =>{
    const idx = TAB_ORDER.indexOf(activePane());
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        const delta = e.key === 'ArrowLeft'? -1 : 1;
        showPane(TAB_ORDER[(idx+delta + TAB_ORDER.length) % TAB_ORDER.length])
    }
})

showPane('html');

function buildwebSrcdoc(withTests=false){
    const html = ed_html.getValue();
    const css = ed_css.getValue();
    const js = ed_js.getValue()
    const tests = ($('#testArea')?.value || '').trim();
    
    return `<!DOCTYPE html>

    <html lang="en" dir= "ltr">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
            ${css}\n</style>
               
            </head>
              
            <body>

            ${html}

            <script>
                 
            try{
                ${js}

                ${withTests && tests ? `\n/* tests */\n${tests}` : ''}
            } catch (e){

             console.error(e)
             }

            <\/script>
            </body>

    </html>`;
     

}


function runWeb(withTests = false){
    preview.srcdoc = buildwebSrcdoc(withTests);
    log(withTests ? "Run with tests" : "Web preview updated.");

}

$('#runweb')?.addEventListener('click',() => runWeb(false));

$('#runTests')?.addEventListener('click',() => runWeb(true));

$('#openPreview')?.addEventListener('click', () => {
    const src = buildwebSrcdoc(false);

    const w = window.open('about:blank');
    w.document.open();
    w.document.write(src);
    w.document.close();// close the window to prevent loosing resources

});


function projectJSON(){
    return {
        version: 1,
        kind: 'web-only',
        assignment: $('#assignment')?.value || '',
        test: $('#testArea')?.value || '',
        html: ed_html.getValue(),
        css: ed_css.getValue(),
        js: ed_js.getValue()
    };
}

function loadProject(obj){

    try{
        if($('#assignment')) $('#assignment').value = obj.assignment || '';

        if($('#testArea')) $('#testArea').value = obj.test || '';
        
        ed_html.setValue(obj.html || '', -1);

        ed_css.setValue(obj.css || '', -1);

        ed_js.setValue(obj.js || '', -1);

        log('web project loaded.');

    } catch(e){

        log ('Unable to load project:' + e, 'error');
    }
}

function SetDefaultContent(){
    ed_html.setValue(`<!-- Welcome Card-->        
       <div class="container">
            <h1> Welcome! to my Web-Editor.</h1>
            <h2>Am Hradhay Yagnik</h2>    
            <button class="btn" id="myBtn"> Pls click here</button>
      </div>`,-1);
    ed_css.setValue(`
        .container{display:flex;
             flex-direction: column;
             align-items: center; 
             justify-content: center;
            
              margin: 0 auto;         
              width: max-content; 
            
             background: linear-gradient(180deg, rgb(215, 99, 0595));
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0,0,0.25);}
        h1,h2{ 
             font-family: sans-serif;
        }
        h2{
           color: rgba(255, 255, 255, 0.8);
           margin-top: 0px; }

        button{
         background:linear-gradient(180deg,  rgba(213, 95, 0595));
         border-radius: 10px;}`,-1);

    ed_js.setValue(`
        document.getElementById("myBtn").addEventListener("click", () => {
  alert("Well done Start editing ")
})`,-1);

}

function saveproject(){
    try{
        const data = JSON.stringify(projectJSON(),null,2);
        localStorage.setItem(STORAGE_KEY,data);
        const blob = new Blob([data], {
                type: 'application/json'
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'academy-web.json';
        a.click(); // this is a programmatic way of clicking on element.
        log('Saved locally and downloaded JSON file');
    } catch (e){
        log('Unable to save:' + e, 'error');
    }
}

$('#saveBtn')?.addEventListener('click', saveproject);
$('#loadBtn')?.addEventListener('click', () => $('#openFile').click());
$('#openFile')?.addEventListener('change', async (e) => {
    const f = e.target.files?.[0];
    if (!f){   return;   }
    try {
        const obj = JSON.parse(await f.text());
        loadProject(obj);
    }catch (err) {
        log('Invalid project file', 'error');
    }
});

try {
    const cache = localStorage.getItem(STORAGE_KEY);
    if (cache) {
        loadProject(JSON.parse(cache));
    }else{
        SetDefaultContent();
    }
   
}catch{
    SetDefaultContent();
}

log('Ready -web only Editor (HTML / CSS /Java Script)'); 