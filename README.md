[![Build Status](https://travis-ci.org/TheNoim/DSBAPI.svg?branch=master)](https://travis-ci.org/TheNoim/DSBAPI)
## Classes

<dl>
<dt><a href="#DSB">DSB</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#V1Object">V1Object</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="DSB"></a>

## DSB
**Kind**: global class  

* [DSB](#DSB)
    * [new DSB(username, password, cookieJar)](#new_DSB_new)
    * [.getData([Callback])](#DSB+getData) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getDataV1([Callback])](#DSB+getDataV1) ⇒ <code>[Promise.&lt;V1Object&gt;](#V1Object)</code>
    * [.getDataWithUUIDV1(uuid, [Callback])](#DSB+getDataWithUUIDV1) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.getUUIDV1([Callback])](#DSB+getUUIDV1) ⇒ <code>Promise.&lt;String&gt;</code>

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

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [Callback] | <code>function</code> | <code></code> | If you add a callback, no Promise will be returned. |

<a name="DSB+getDataV1"></a>

### dsB.getDataV1([Callback]) ⇒ <code>[Promise.&lt;V1Object&gt;](#V1Object)</code>
Get the data from the old API (https://iphone.dsbcontrol.de/)

**Kind**: instance method of <code>[DSB](#DSB)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [Callback] | <code>function</code> | <code></code> | If you add a callback, no Promise will be returned. |

<a name="DSB+getDataWithUUIDV1"></a>

### dsB.getDataWithUUIDV1(uuid, [Callback]) ⇒ <code>Promise.&lt;String&gt;</code>
Get the data from the old API by given uuid (https://iphone.dsbcontrol.de/)

**Kind**: instance method of <code>[DSB](#DSB)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| uuid | <code>string</code> |  |  |
| [Callback] | <code>function</code> | <code></code> | If you add a callback, no Promise will be returned. |

<a name="DSB+getUUIDV1"></a>

### dsB.getUUIDV1([Callback]) ⇒ <code>Promise.&lt;String&gt;</code>
Get the uuid from the old API (https://iphone.dsbcontrol.de/)

**Kind**: instance method of <code>[DSB](#DSB)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [Callback] | <code>function</code> | <code></code> | If you add a callback, no Promise will be returned. |

<a name="V1Object"></a>

## V1Object : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| news | <code>Array</code> | 
| timetables | <code>Array</code> | 

