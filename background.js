const copyTitleAndLink = async () => {
    const fixedMessageId = '__fixed-message-id';
    const tipStyle = `
#__fixed-message-id {
    position: fixed;
    right: 32px;
    top: 32px;
    background-color: white;
    z-index: 9999;

    padding: 8px 16px;
    min-width: 200px;
    border-radius: 8px;
    font-size: 12px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

#__fixed-message-id.success {
    border: 2px solid #2ecc71;
}

#__fixed-message-id.fail {
    border: 2px solid #e74c3c;
}
`;
    // 把提示信息插入到网页中
    const tipMessage = (isOk) => {
        const styleSheet = document.createElement('style');
        styleSheet.innerText = tipStyle;
        document.head.appendChild(styleSheet);

        let div = document.querySelector(`#${fixedMessageId}`);
        if (!div) {
            div = document.createElement('div');
            div.setAttribute('id', fixedMessageId);
        }
        if (isOk) {
            div.innerText = '复制成功 🎉';
            div.setAttribute('class', 'success');
        } else {
            div.innerText = '复制失败 😞';
            div.setAttribute('class', 'fail');
        }

        document.body.append(div);

        setTimeout(() => {
            div.remove();
        }, 2000);
    };
    try {
        const h1Element = document.querySelector('h1');
        const title = h1Element.innerText;
        // 获取到需要的 Markdown 格式
        const titleAndLink = `[${title}](${window.location.href})`;
        // 执行剪切板操作，可参考 [剪贴板操作 Clipboard API 教程](https://www.ruanyifeng.com/blog/2021/01/clipboard-api.html)
        await navigator.clipboard.writeText(titleAndLink);
        tipMessage(true);
    } catch (err) {
        console.error('Failed to copy: ', err);
        tipMessage(false);
    }
};

const runCopy = async () => {
    // 找到当前活跃的浏览器 tab 标签
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 给活跃的 tab 标签执行 copyTitleAndLink 函数
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: copyTitleAndLink,
    });
};

chrome.commands.onCommand.addListener((command) => {
    if (command === 'run-copy') {
        // 在监听到 run-copy command 时执行 runCopy 函数
        runCopy();
    }
});
