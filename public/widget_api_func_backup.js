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
    $(`#${actionId}`).text('✅');
}

function registerEmojiAction(action) {
    widgetApi.on(`action:${action}`, () => {
        setCompleteEmoji(`action-${action}`);
    });
}

const params = parseFragment();
$("#parsed-fragment").text(JSON.stringify(params, null, 4));

const requestCapabilities = JSON.parse(localStorage.getItem("mxw_caps_to_request") || "[]");
requestCapabilities.push(mxwidgets.MatrixCapabilities.Screenshots);

$("input.cap-cb").each((_, c) => {
    const cb = $(c);
    if (requestCapabilities.includes(cb.data('cap'))) {
        cb.attr('checked', true);
    }
});

const widgetApi = new mxwidgets.WidgetApi(params['widgetId']);

widgetApi.requestCapabilities(requestCapabilities);

widgetApi.on("ready", () => {
    setCompleteEmoji("action-ready");
});

registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.Capabilities);
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.SupportedApiVersions);
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.WidgetConfig);
registerEmojiAction(mxwidgets.WidgetApiToWidgetAction.NotifyCapabilities);

$("#requested-capabilities").text(requestCapabilities.join('\n') || "<none>");
widgetApi.on(`action:${mxwidgets.WidgetApiToWidgetAction.NotifyCapabilities}`, (ev) => {
    $("#granted-capabilities").text(ev.detail.data.approved.join('\n') || "<none>");
    $("#claimed-capabilities").text(ev.detail.data.requested.join('\n') || "<none>");
});

widgetApi.on(`action:${mxwidgets.WidgetApiToWidgetAction.TakeScreenshot}`, (ev) => {
    ev.preventDefault();
    fetch("screenshots-working.png").then(r => r.blob()).then(b => {
        widgetApi.transport.reply(ev.detail, {
            screenshot: b,
        });
    });
});

widgetApi.on(`action:${mxwidgets.WidgetApiToWidgetAction.UpdateVisibility}`, (ev) => {
    console.log("[DbgWidget] On screen? ", ev.detail.data.visibility);
    $("on-screen").text(ev.detail.data.visibility);
});

widgetApi.on("ready", () => {
    // XXX: Private method access
    widgetApi.getClientVersions().then(versions => {
        $("#api-versions").text(JSON.stringify(versions));
    });
});

widgetApi.start();

function requestOIDC() {
    widgetApi.requestOpenIDConnectToken().then(token => {
        $("#oidc-result").text(JSON.stringify(token, null, 4));
    }).catch(error => {
        $("#oidc-result").text("ERROR: " + error.message);
    });
}

function sendContentLoaded() {
    widgetApi.sendContentLoaded();
}

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

function updateCapabilities() {
    const caps = [];
    $("input.cap-cb").each((_, c) => {
        const cb = $(c);
        if (!cb.is(':checked')) return;
        caps.push(cb.data('cap'));
    });
    localStorage.setItem("mxw_caps_to_request", JSON.stringify(caps));
}

function intercept(ev) {
            if (!widgetApi) return; // let the browser work

            ev.preventDefault();
            ev.stopPropagation();
            widgetApi.navigateTo("!QbkIuZYQzpoQlLcyxd:quranic.network");
        }

export function navigateLink(url) {
    // TODO: Use widget-api function for this once available
    widgetApi.transport.send("org.matrix.msc2931.navigate", {uri: url});
}
