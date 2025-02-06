import path from "path";
import {readFileSync, existsSync} from 'fs';
import {fileURLToPath} from "url";
import '../libs_drpy/jinja.js'

export function getParsesDict(host) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const jx_conf = path.join(__dirname, '../config/parses.conf');
    let jx_list = [];
    if (existsSync(jx_conf)) {
        const jx_conf_text = readFileSync(jx_conf, 'utf-8');
        let jx_conf_content = jx_conf_text.trim();
        let var_dict = {host, hostName: host.split(':').length > 1 ? host.slice(0, host.lastIndexOf(":")) : host};
        // console.log(var_dict);
        jx_conf_content = jinja.render(jx_conf_content, var_dict);
        const jxs = jx_conf_content.split('\n').filter(it => it.trim() && !it.trim().startsWith('#')).map(it => it.trim());
        // console.log(jxs);
        jxs.forEach((jx) => {
            let jx_arr = jx.split(',');
            let jx_name = jx_arr[0];
            let jx_url = jx_arr[1];
            let jx_type = jx_arr.length > 2 ? Number(jx_arr[2]) || 0 : 0;
            let jx_ua = jx_arr.length > 3 ? jx_arr[3] : 'Mozilla/5.0';
            let jx_flag = jx_arr.length > 4 ? jx_arr[4] : '';
            let jx_obj = {
                'name': jx_name,
                'url': jx_url,
                'type': jx_type,
                "header": {
                    "User-Agent": jx_ua
                },
            }
            if (jx_flag) {
                jx_obj.ext = {
                    "flag": jx_flag.split('|')
                }
            }
            jx_list.push(jx_obj);
        });
    }
    // console.log('getParsesDict:', jx_conf);
    // console.log(jx_list);
    return jx_list
}
