
function sendLegacySticker() {
    widgetApi.sendSticker({
        name: "مهربانترین مادر",
        description: "همی گویم و گفته‌ام بارها.. ",
        content: {
            url: "mxc://quranic.network/fdQmKbpYrsLxdzgVlLNoeFby",
            info: {
                w: 200,
                h: 200,
                mimetype: "image/png"
            },
        },
    });
}

function setSticky(sticky) {
    widgetApi.setAlwaysOnScreen(sticky);
}

function intercept(ev, idx) {
    if (!widgetApi) return; // let the browser work

    ev.preventDefault();
    ev.stopPropagation();
    widgetApi.navigateTo(idx);
}

export function navigateLink(url) {
    // TODO: Use widget-api function for this once available
    widgetApi.transport.send("org.matrix.msc2931.navigate", {uri: url});
}

function parseFragment() {
    const fragmentString = (window.location.hash || "?");
    const search = new URLSearchParams(fragmentString.substring(Math.max(fragmentString.indexOf('?'), 0)));
    const object = {};
    for (const key of search.keys()) {
        object[key] = search.get(key);
    }
    return object;
}

function setCompleteEmoji(actionId) {
    alert(actionId, ' is working!');
}

function registerEmojiAction(action) {
    widgetApi.on(`action:${action}`, () => {
        setCompleteEmoji(`action-${action}`);
    });
}

const params = parseFragment();
const requestCapabilities = JSON.parse(localStorage.getItem("mxw_caps_to_request") || "[]");
requestCapabilities.push(mxwidgets.MatrixCapabilities.Screenshots);
const widgetApi = new mxwidgets.WidgetApi(params['widgetId']);
widgetApi.requestCapabilities(requestCapabilities);
widgetApi.on("ready", () => {
    setCompleteEmoji("action-ready");
});
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.Capabilities);
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.SupportedApiVersions);
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.WidgetConfig);
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.NotifyCapabilities);

widgetApi.start();
sendLegacySticker();
