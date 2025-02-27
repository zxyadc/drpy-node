import path from "path";
import {existsSync, readFileSync} from "fs";

export function getQueryObj(query) {
    // 使用 URLSearchParams
    const searchParams = new URLSearchParams(query);

    const queryObject = {};
    for (const [key, value] of searchParams.entries()) {
        queryObject[key] = value;
    }
    return queryObject
}

export function getSitesMap(configDir) {
    let SitesMap = {};
    let SitesMapPath = path.join(configDir, './传参.txt');
    if (existsSync(SitesMapPath)) {
        try {
            let SitesMapText = readFileSync(SitesMapPath, 'utf-8');
            let SitesMapLines = SitesMapText.split('\n').filter(it => it);
            SitesMapLines.forEach((line) => {
                let SitesMapKey = line.split('@')[0].trim();
                if (!SitesMap.hasOwnProperty(SitesMapKey)) {
                    SitesMap[SitesMapKey] = [];
                }
                let SitesMapQuery = line.split('@')[1].trim();
                let SitesMapAlias = line.split('@').length > 2 ? line.split('@')[2].trim() : SitesMapKey;
                SitesMap[SitesMapKey].push({
                    alias: SitesMapAlias,
                    queryStr: SitesMapQuery,
                    queryObject: getQueryObj(SitesMapQuery),
                });
            });
            return SitesMap
        } catch (e) {

        }
    }
    return SitesMap
}
