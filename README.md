<a name="DSB"></a>

## DSB
**Kind**: global class  

* [DSB](#DSB)
    * [new DSB(username, password, cookieJar)](#new_DSB_new)
    * [.getData([Callback])](#DSB+getData) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getDataV1()](#DSB+getDataV1)

<a name="new_DSB_new"></a>

### new DSB(username, password, cookieJar)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| username | <code>string</code> |  | The username for your school |
| password | <code>string</code> |  | The password for your school |
| cookieJar | <code>string</code> | <code>null</code> | Optional path to a file for caching the login cookies |

<a name="DSB+getData"></a>

### dsB.getData([Callback]) ⇒ <code>Promise.&lt;Object&gt;</code>
Get data from mobile.dsbcontrol.de (The API used by mobile.dsbcontrol.de and every APP)

**Kind**: instance method of <code>[DSB](#DSB)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [Callback] | <code>function</code> | <code></code> | 

<a name="DSB+getDataV1"></a>

### dsB.getDataV1()
Get the data from the old API (https://iphone.dsbcontrol.de/)

**Kind**: instance method of <code>[DSB](#DSB)</code>