// ChatView namespace

window.ChatView = window.ChatView || {};

// action types

const LOAD = 'LOAD';
const POST = 'POST';
const SELECT_THREAD = 'SELECT_THREAD';
const SET_THREAD_TITLE = 'SET_THREAD_TITLE';

// action creators

ChatView.act = {
    load: function (data) {
        return {
            type: LOAD,
            data: data
        };
    },
    post: function (threadId, user, text) {
        return {
            type: POST,
            threadId: threadId,
            user: user,
            text: text
        };
    },
    selectThread: function (id) {
        return {
            type: SELECT_THREAD,
            id: id
        };
    },
    setThreadTitle: function (id, title) {
        return {
            type: SET_THREAD_TITLE,
            id: id,
            title: title
        };
    }
};

// reducer

const emptyState = {
    selectedThreadId: null,
    threads: {},
    user: {}
};

function updateLastRead(user, threadId, threadLength) {
    const lrm = Object.assign({}, user.lastReadMessage);
    lrm[threadId] = threadLength - 1;
    return Object.assign({}, user, {lastReadMessage: lrm});
}

function reducer (state, action) {
    if (!state) return emptyState;

    var threadId, thread, uThread, uThreads, uUser;

    switch (action.type) {
        case LOAD:
            return action.data;
        case POST:
            threadId = action.threadId;
            thread = state.threads[threadId];
            if (!thread) return state;
            const messages = thread.messages.slice(0);
            messages.push({
                user: action.user,
                text: action.text
            });
            uThread = Object.assign({}, thread, {messages: messages});
            uThreads = Object.assign({}, state.threads);
            uThreads[threadId] = uThread;
            uUser = (threadId === state.selectedThreadId) ? 
                updateLastRead(state.user, threadId, messages.length) :
                state.user;
            return Object.assign({}, state, {threads: uThreads, user: uUser});
        case SELECT_THREAD:
            threadId = action.id;
            thread = state.threads[threadId];
            if (!thread || threadId === state.selectedThreadId) return state;
            return Object.assign({}, state, {
                selectedThreadId: threadId,
                user: updateLastRead(state.user, threadId, thread.messages.length)
            });
        case SET_THREAD_TITLE:
            threadId = action.id;
            thread = state.threads[threadId];
            if (!thread) return state;
            uThread = Object.assign({}, thread, {title: action.title});
            uThreads = Object.assign({}, state.threads);
            uThreads[threadId] = uThread;
            return Object.assign({}, state, {threads: uThreads});
        default:
            return state;
    }
}

// selectors

function rawThreadsSelector (state) {
    return state.threads;
}

function selectedThreadIdSelector (state) {
    return state.selectedThreadId;
}

function lastReadMessageSelector (state) {
    return state.user.lastReadMessage;
}

const threadsSelector = Reselect.createSelector(
    rawThreadsSelector,
    lastReadMessageSelector,
    function (rawThreads, lastReadMessage) {
        return Object.keys(rawThreads).map(function (key) {
            const rawThread = rawThreads[key];
            const messages = rawThread.messages;
            return Object.assign({}, rawThread, {
                id: key,
                lastMessage: messages[messages.length - 1].text,
                unread: messages.length - lastReadMessage[key] - 1
            });
        })
    }
);

const selectedThreadSelector = Reselect.createSelector(
    threadsSelector,
    selectedThreadIdSelector,
    function (threads, selectedThreadId) {
        return threads[selectedThreadId];
    }
);

const unreadSelector = Reselect.createSelector(
    threadsSelector,
    function (threads) {
        return threads.reduce(function (n, thread) {
            return n + Boolean(thread.unread);
        }, 0);
    }
);

ChatView.select = {
    threads: threadsSelector,
    selectedThread: selectedThreadSelector,
    unread: unreadSelector
}

// store

const store = Redux.createStore(reducer, window.devToolsExtension && window.devToolsExtension());
ChatView.store = store;