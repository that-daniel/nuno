---
title: "Kitchen Sink: Every Prose Element"
description: "A test page that exercises callouts, blockquotes, code, tables and lists against the nuno design."
date: 2026-01-15T09:00:00.000Z
categories: ["Homelab"]
tags: ["Homelab", "Kubernetes", "Networking"]
---

A worked example, written as an ordinary post, so that every prose element the
theme styles appears at least once on one page. The story is invented; the
markup is not.

It was past midnight and the automation pipeline had crashed. Again. It had been
failing for days — same pattern, same timing, always when the network got
serious. And the diagnosis had finally turned up.

## The symptom

Every time the pipeline pulled a large image, the node went NotReady. Not
slowly. Instantly.

```bash
kubectl get nodes
NAME       STATUS     ROLES           AGE   VERSION
homelab    NotReady   control-plane   212d  v1.31.2
```

> The bottleneck is never where you expect it. It's the cheapest part in the chain.
>
> — a note to future me

## Finding the bottleneck

I started with the obvious suspects: CPU, memory, disk. All fine. Then I looked
at the network, and the numbers stopped making sense.

{{< callout type="tip" >}}
Check the LAN port speed on every hop, not just the switch. Extenders and cheap
routers often cap at 100Mbps even when the WiFi is faster.
{{< /callout >}}

{{< callout type="warning" >}}
Draining a node while etcd is on it will take the control plane down with it.
Cordon first, then drain.
{{< /callout >}}

{{< callout type="note" >}}
This is the neutral variant, for asides that are neither advice nor a hazard.
{{< /callout >}}

### A third-level heading

Some inline elements: a [link to the archive](/archives/), some `inline code`,
**bold text**, and *italics*.

- A bullet in a list
- A second bullet, longer, so it wraps onto a second line and we can check the
  leading holds up
- A third

1. Ordered one
2. Ordered two

| Component | Rated | Actual |
|---|---|---|
| Switch | 1 Gbps | 1 Gbps |
| Extender LAN | 1 Gbps | 100 Mbps |
| NIC | 1 Gbps | 100 Mbps |

## What I learned

Measure the boring parts first.
