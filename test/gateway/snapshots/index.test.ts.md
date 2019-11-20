# Snapshot report for `test/gateway/index.test.ts`

The actual snapshot is saved in `index.test.ts.snap`.

Generated by [AVA](https://ava.li).

## get artifact

> Snapshot 1

    `🇺🇲 US = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true, obfs=tls, obfs-host=gateway-carry.icloud.com, tfo=true␊
    Snell = snell, us.example.com, 443, psk=password, obfs=tls␊
    HTTPS = https, us.example.com, 443, username, password␊
    🇺🇸US 1 = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, obfs=tls, obfs-host=gateway-carry.icloud.com␊
    🇺🇸US 2 = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module␊
    ss1 = custom, server, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true␊
    ss2 = custom, server, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=false, obfs=tls, obfs-host=www.bing.com␊
    vmess = vmess, server, 443, username=uuid␊
    http = https, server, 443, username, password␊
    snell = snell, server, 44046, psk=yourpsk, obfs=http␊
    ss4 = custom, server, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=false, obfs=tls, obfs-host=example.com␊
    ----␊
    🇺🇲 US, Snell, HTTPS, 🇺🇸US 1, 🇺🇸US 2, ss1, ss2, vmess, http, snell, ss4␊
    `

## list artifact

> Snapshot 1

    `␊
        ␊
          <li class="artifact">␊
            <div class="inner-wrapper">␊
              <div class="name">test.conf</div>␊
              <pre class="preview">/get-artifact/test.conf?access_token=abcd</pre>␊
              <div class="tag-list clearfix">␊
                ␊
                <div class="tag">Provider: ss</div>␊
                ␊
                ␊
                ␊
                  ␊
                    ␊
                    <div class="tag">Provider: custom</div>␊
                    ␊
                  ␊
                    ␊
                    <div class="tag">Provider: clash</div>␊
                    ␊
                  ␊
                ␊
              </div>␊
              <div class="link-group">␊
                ␊
                ␊
                <a rel="nofollow" class="link pure-button pure-button-primary" target="_blank" href="/get-artifact/test.conf?access_token=abcd&amp;dl=1">下载</a>␊
                <a rel="nofollow" class="link pure-button pure-button-primary" target="_blank" href="/get-artifact/test.conf?access_token=abcd">预览</a>␊
                <button class="ctc link pure-button pure-button-primary" data-clipboard-text="/get-artifact/test.conf?access_token=abcd">复制地址</button>␊
                ␊
                ␊
    ␊
                ␊
              </div>␊
            </div>␊
          </li>␊
        ␊
        `

## transform artifact qx

> Snapshot 1

    `shadowsocks=us.example.com:443, method=chacha20-ietf-poly1305, password=password, obfs=tls, obfs-host=gateway-carry.icloud.com, udp-relay=true, fast-open=true, tag=🇺🇲 US␊
    http=us.example.com:443, username=username, password=password, over-tls=true, tag=HTTPS␊
    shadowsocks=us.example.com:443, method=chacha20-ietf-poly1305, password=password, obfs=tls, obfs-host=gateway-carry.icloud.com, tag=🇺🇸US 1␊
    shadowsocks=us.example.com:443, method=chacha20-ietf-poly1305, password=password, tag=🇺🇸US 2␊
    shadowsocks=server:443, method=chacha20-ietf-poly1305, password=password, udp-relay=true, tag=ss1␊
    shadowsocks=server:443, method=chacha20-ietf-poly1305, password=password, obfs=tls, obfs-host=www.bing.com, tag=ss2␊
    vmess=server:443, method=chacha20-ietf-poly1305, password=uuid, udp-relay=true, tag=vmess␊
    http=server:443, username=username, password=password, over-tls=true, tag=http␊
    shadowsocks=server:443, method=chacha20-ietf-poly1305, password=password, obfs=tls, obfs-host=example.com, tag=ss4`

> Snapshot 2

    'shadowsocks=us.example.com:443, method=chacha20-ietf-poly1305, password=password, obfs=tls, obfs-host=gateway-carry.icloud.com, udp-relay=true, fast-open=true, tag=🇺🇲 US'

## transform artifact surge

> Snapshot 1

    `🇺🇲 US = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true, obfs=tls, obfs-host=gateway-carry.icloud.com, tfo=true␊
    Snell = snell, us.example.com, 443, psk=password, obfs=tls␊
    HTTPS = https, us.example.com, 443, username, password␊
    🇺🇸US 1 = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, obfs=tls, obfs-host=gateway-carry.icloud.com␊
    🇺🇸US 2 = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module␊
    ss1 = custom, server, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true␊
    ss2 = custom, server, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=false, obfs=tls, obfs-host=www.bing.com␊
    vmess = vmess, server, 443, username=uuid␊
    http = https, server, 443, username, password␊
    snell = snell, server, 44046, psk=yourpsk, obfs=http␊
    ss4 = custom, server, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=false, obfs=tls, obfs-host=example.com`

> Snapshot 2

    `🇺🇸US 1 = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, obfs=tls, obfs-host=gateway-carry.icloud.com␊
    🇺🇸US 2 = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module␊
    🇺🇲 US = custom, us.example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true, obfs=tls, obfs-host=gateway-carry.icloud.com, tfo=true`