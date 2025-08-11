document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const appContainer = document.querySelector('.app-container');
    const newMemoBtn = document.getElementById('new-memo-btn');
    const memoList = document.getElementById('memo-list');
    const memoTitleInput = document.getElementById('memo-title');
    const memoBodyInput = document.getElementById('memo-body');
    const saveMemoBtn = document.getElementById('save-memo-btn');
    const deleteMemoBtn = document.getElementById('delete-memo-btn');
    const backToListBtn = document.getElementById('back-to-list-btn');

    let currentMemoId = null;

    // --- 画面表示切り替えの関数 ---
    const showEditorView = () => {
        appContainer.classList.add('editing');
    };

    const showListView = () => {
        appContainer.classList.remove('editing');
    };

    // --- データ関連の関数 ---
    const getMemos = () => {
        const memos = localStorage.getItem('memos');
        return memos ? JSON.parse(memos) : [];
    };

    const saveMemos = (memos) => {
        localStorage.setItem('memos', JSON.stringify(memos));
    };

    // --- UI関連の関数 ---
    const renderMemoList = () => {
        const memos = getMemos();
        memoList.innerHTML = '';
        memos.sort((a, b) => b.id - a.id);

        memos.forEach(memo => {
            const li = document.createElement('li');
            li.textContent = memo.title || '無題のメモ';
            li.dataset.id = memo.id;

            if (memo.id === currentMemoId) {
                li.classList.add('selected');
            }

            li.addEventListener('click', () => {
                displayMemo(memo.id);
            });

            memoList.appendChild(li);
        });
    };

    const displayMemo = (id) => {
        const memos = getMemos();
        const memo = memos.find(m => m.id === id);

        if (memo) {
            currentMemoId = memo.id;
            memoTitleInput.value = memo.title;
            memoBodyInput.value = memo.body;
            showEditorView();
        } else {
            clearEditor();
        }
        renderMemoList();
    };

    const clearEditor = () => {
        currentMemoId = null;
        memoTitleInput.value = '';
        memoBodyInput.value = '';
    };

    // --- イベントリスナーの設定 ---
    newMemoBtn.addEventListener('click', () => {
        clearEditor();
        renderMemoList();
        showEditorView();
        memoTitleInput.focus();
    });

    backToListBtn.addEventListener('click', () => {
        showListView();
    });

    saveMemoBtn.addEventListener('click', () => {
        const title = memoTitleInput.value.trim();
        const body = memoBodyInput.value.trim();
        let memos = getMemos();

        if (currentMemoId) {
            const memoIndex = memos.findIndex(m => m.id === currentMemoId);
            if (memoIndex > -1) {
                memos[memoIndex].title = title;
                memos[memoIndex].body = body;
            }
        } else {
            const newMemo = {
                id: Date.now(),
                title: title,
                body: body
            };
            memos.push(newMemo);
            currentMemoId = newMemo.id;
        }

        saveMemos(memos);
        alert('メモが保存されました！'); // Added this line
        renderMemoList();
        showListView(); // 保存後に一覧画面に戻る
        // スマホ表示を考慮し、保存後に一覧へ戻るオプションもあるが、
        // ここでは編集を継続できるようにエディタ表示のままにする。
        //displayMemo(currentMemoId);
    });

    deleteMemoBtn.addEventListener('click', () => {
        if (currentMemoId === null) {
            alert('削除するメモが選択されていません。');
            return;
        }

        if (confirm('本当にこのメモを削除しますか？')) {
            let memos = getMemos();
            memos = memos.filter(m => m.id !== currentMemoId);
            saveMemos(memos);
            clearEditor();
            renderMemoList();
            showListView(); // 削除後は一覧画面に戻る
        }
    });

    // --- 初期化処理 ---
    renderMemoList();
});