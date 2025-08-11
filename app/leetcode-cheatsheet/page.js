'use client'

import React, { useEffect, useState } from 'react'

// Lightweight, dependency-free copyable code block
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  return (
    <pre className="relative overflow-auto rounded-xl border border-slate-700 bg-slate-900/70 p-4">
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          } catch {}
        }}
        className="absolute right-2 top-2 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:text-white"
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <code className="whitespace-pre text-sm">{code}</code>
    </pre>
  )
}

const SECTIONS = [
  'py-tips',
  'big-o',
  'arrays-strings',
  'two-pointers',
  'sliding-window',
  'prefix',
  'binary-search',
  'sorting',
  'heap',
  'stack',
  'queue-deque',
  'linked-list',
  'trees',
  'trie',
  'graphs',
  'union-find',
  'toposort',
  'dijkstra',
  'intervals',
  'grid',
  'dp',
  'backtracking',
  'bit',
  'fenwick',
  'math',
  'kmp',
]

const LABELS = {
  'py-tips': 'Python Tips',
  'big-o': 'Big‑O / Ops',
  'arrays-strings': 'Arrays & Strings',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  prefix: 'Prefix / XOR',
  'binary-search': 'Binary Search',
  sorting: 'Sorting',
  heap: 'Heap / PQ',
  stack: 'Stack / Monotonic',
  'queue-deque': 'Queue / Deque',
  'linked-list': 'Linked List',
  trees: 'Binary Trees',
  trie: 'Trie',
  graphs: 'Graphs',
  'union-find': 'Union‑Find (DSU)',
  toposort: 'Topological Sort',
  dijkstra: 'Dijkstra',
  intervals: 'Intervals',
  grid: 'Grids / Flood‑Fill',
  dp: 'Dynamic Programming',
  backtracking: 'Backtracking',
  bit: 'Bit Tricks',
  fenwick: 'Fenwick / SegTree',
  math: 'Math / Number Theory',
  kmp: 'KMP (String)',
}

export default function Page() {
  const [filter, setFilter] = useState('')

  // Filter sections client-side when the search box changes
  useEffect(() => {
    const term = filter.trim().toLowerCase()
    const sections = Array.from(document.querySelectorAll('[data-section]'))
    sections.forEach((sec) => {
      if (!term) {
        sec.style.display = ''
        return
      }
      const hit = (sec.textContent || '').toLowerCase().includes(term)
      sec.style.display = hit ? '' : 'none'
    })
    const links = Array.from(document.querySelectorAll('a[data-nav]'))
    links.forEach((a) => {
      const id = a.getAttribute('href')?.slice(1) || ''
      const sec = document.getElementById(id)
      a.style.display = !term || (sec && sec.style.display !== 'none') ? '' : 'none'
    })
  }, [filter])

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800/70 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">LeetCode DSA Cheatsheet · Python 3</h1>

          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter sections or code… (try ‘heap’, ‘two pointers’, ‘dijkstra’)"
            className="ml-auto w-full min-w-[220px] max-w-md rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            type="search"
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[260px,1fr]">
        <nav id="toc" className="sticky top-20 h-max rounded-xl border border-slate-800 bg-slate-900/60 p-3 lg:self-start">
          <h3 className="px-2 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Jump to</h3>
          <div className="space-y-0.5">
            {SECTIONS.map((id) => (
              <a key={id} data-nav href={`#${id}`} className="block rounded-lg px-2 py-1 text-sm text-slate-200 hover:bg-slate-800/60">
                {LABELS[id]}
              </a>
            ))}
          </div>
        </nav>

        <div id="content" className="space-y-4">
          {/* Python Tips */}
          <section id="py-tips" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Python Tips & Snippets</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-2">Imports</strong>
                <CodeBlock code={`from collections import defaultdict, Counter, deque\nfrom functools import lru_cache\nimport heapq, bisect, math\n`} />
              </div>
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-2">Data classes for LC</strong>
                <CodeBlock code={`class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val, self.next = val, next\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n`} />
              </div>
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-2">Memoization</strong>
                <CodeBlock code={`@lru_cache(maxsize=None)\ndef f(i, j):\n    # return something based on (i, j)\n    ...\n`} />
              </div>
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-2">Handy idioms</strong>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  <li><code>for i, x in enumerate(nums): ...</code></li>
                  <li><code>sorted(items, key=lambda t: (t[0], -t[1]))</code></li>
                  <li><code>defaultdict(list/int/set)</code> for grouping/counting.</li>
                  <li><code>bisect_left/right(a, x)</code> for lower/upper bounds.</li>
                  <li><code>heapq</code> is a min‑heap; use <code>-x</code> for max‑heap.</li>
                  <li><code>x.bit_count()</code> (or <code>bin(x).count(`&apos;`1`&apos;`)</code>) to count set bits.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Big-O */}
          <section id="big-o" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Big‑O & Common Ops</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-1">Lists</strong>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  <li>Append / pop end: <span className="text-emerald-400">O(1)</span> amortized</li>
                  <li>Insert / pop front / remove: O(n)</li>
                  <li>Index / set by index: <span className="text-emerald-400">O(1)</span></li>
                  <li>Slice copy: O(k)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-1">Dict / Set (avg)</strong>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  <li>Insert / lookup / delete: <span className="text-emerald-400">O(1)</span></li>
                  <li>Iteration: O(n)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-1">Heap</strong>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  <li>Push / pop / replace: O(log n)</li>
                  <li>Build from list: O(n)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 p-3">
                <strong className="block pb-1">Graph</strong>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  <li>BFS/DFS: O(n + m)</li>
                  <li>Dijkstra (binary heap): O(m log n)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Arrays & Strings */}
          <section id="arrays-strings" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Arrays & Strings</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Kadane (max subarray sum)</summary>
              <CodeBlock code={`def kadane(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Counting / frequency</summary>
              <CodeBlock code={`from collections import Counter\n\ncnt = Counter(nums)\n# most_common k\nk_most = [x for x, _ in cnt.most_common(k)]\n`} />
            </details>
          </section>

          {/* Two Pointers */}
          <section id="two-pointers" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Two Pointers</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Sorted array: pair sum</summary>
              <CodeBlock code={`def two_sum_sorted(a, target):\n    i, j = 0, len(a) - 1\n    while i < j:\n        s = a[i] + a[j]\n        if s == target:\n            return i, j\n        if s < target:\n            i += 1\n        else:\n            j -= 1\n    return -1, -1\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Remove duplicates in‑place (LC 26)</summary>
              <CodeBlock code={`def remove_dups(nums):\n    if not nums: return 0\n    w = 1\n    for r in range(1, len(nums)):\n        if nums[r] != nums[w-1]:\n            nums[w] = nums[r]\n            w += 1\n    return w\n`} />
            </details>
          </section>

          {/* Sliding Window */}
          <section id="sliding-window" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Sliding Window</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Generic template (shrink‑while‑bad)</summary>
              <CodeBlock code={`def longest_subarray(nums):\n    best = 0\n    l = 0\n    # maintain window stats\n    for r, x in enumerate(nums):\n        # add x to window\n        # ...\n        while False:  # while window is invalid\n            # remove nums[l] from window\n            l += 1\n        best = max(best, r - l + 1)\n    return best\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Max in window (deque)</summary>
              <CodeBlock code={`from collections import deque\n\ndef maxSlidingWindow(nums, k):\n    dq, out = deque(), []  # store indices\n    for i, x in enumerate(nums):\n        if dq and dq[0] <= i - k:\n            dq.popleft()\n        while dq and nums[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            out.append(nums[dq[0]])\n    return out\n`} />
            </details>
          </section>

          {/* Prefix / XOR */}
          <section id="prefix" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Prefix Sum / XOR</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">1D prefix sum</summary>
              <CodeBlock code={`ps = [0]\nfor x in nums:\n    ps.append(ps[-1] + x)\n# range sum of [l, r]\nrange_sum = ps[r+1] - ps[l]\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Subarrays with XOR = k</summary>
              <CodeBlock code={`from collections import defaultdict\n\ndef count_subarrays_xor(nums, k):\n    freq = defaultdict(int)\n    freq[0] = 1\n    ans = pre = 0\n    for x in nums:\n        pre ^= x\n        ans += freq[pre ^ k]\n        freq[pre] += 1\n    return ans\n`} />
            </details>
          </section>

          {/* Binary Search */}
          <section id="binary-search" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Binary Search</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">First <em>True</em> predicate</summary>
              <CodeBlock code={`def first_true(lo, hi, pred):\n    \"\"\"Find min x in [lo, hi] with pred(x) True. Returns hi+1 if none.\"\"\"\n    hi += 0  # allow inclusive hi\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if pred(mid):\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Bisect (lower/upper bound)</summary>
              <CodeBlock code={`import bisect\n\n# first index i where a[i] >= x\ni = bisect.bisect_left(a, x)\n# first index j where a[j] > x\nj = bisect.bisect_right(a, x)\n`} />
            </details>
          </section>

          {/* Sorting */}
          <section id="sorting" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Sorting</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Custom comparator via key</summary>
              <CodeBlock code={`# sort by freq desc, then value asc\npairs = sorted(pairs, key=lambda t: (-t[1], t[0]))\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Sort intervals</summary>
              <CodeBlock code={`intervals.sort(key=lambda it: (it[0], it[1]))\n`} />
            </details>
          </section>

          {/* Heap / PQ */}
          <section id="heap" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Heap / Priority Queue</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Min‑heap and max‑heap trick</summary>
              <CodeBlock code={`import heapq\n\npq = []\nheapq.heappush(pq, (cost, node))\ncost, node = heapq.heappop(pq)\n\n# max-heap (store negatives)\nheapq.heappush(pq, -x)\n-x = heapq.heappop(pq)\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">K smallest / K largest</summary>
              <CodeBlock code={`import heapq\n# k smallest: O(n log k)\nheap = []\nfor x in nums:\n    if len(heap) < k:\n        heapq.heappush(heap, -x)  # max-heap via negatives\n    else:\n        if -heap[0] > x:\n            heapq.heapreplace(heap, -x)\nans = sorted([-v for v in heap])\n\n# alternatively: heapq.nlargest(k, nums) / nsmallest(k, nums)\n`} />
            </details>
          </section>

          {/* Stack / Monotonic */}
          <section id="stack" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Stack / Monotonic Stack</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Next Greater Element (indices)</summary>
              <CodeBlock code={`def next_greater(nums):\n    n = len(nums)\n    res = [-1] * n\n    st = []  # indices with decreasing values\n    for i, x in enumerate(nums):\n        while st and nums[st[-1]] < x:\n            res[st.pop()] = x\n        st.append(i)\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Largest Rectangle in Histogram</summary>
              <CodeBlock code={`def largestRectangleArea(h):\n    h.append(0)\n    st, best = [], 0  # (start_index, height)\n    for i, x in enumerate(h):\n        start = i\n        while st and st[-1][1] > x:\n            idx, height = st.pop()\n            best = max(best, height * (i - idx))\n            start = idx\n        st.append((start, x))\n    h.pop()\n    return best\n`} />
            </details>
          </section>

          {/* Queue / Deque */}
          <section id="queue-deque" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Queue / Deque</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">BFS template</summary>
              <CodeBlock code={`from collections import deque\n\ndef bfs(start, adj):\n    q, seen = deque([start]), {start}\n    while q:\n        u = q.popleft()\n        for v in adj[u]:\n            if v not in seen:\n                seen.add(v)\n                q.append(v)\n`} />
            </details>
          </section>

          {/* Linked List */}
          <section id="linked-list" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Linked List</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Reverse list (iterative)</summary>
              <CodeBlock code={`def reverse(head):\n    prev, cur = None, head\n    while cur:\n        cur.next, prev, cur = prev, cur, cur.next\n    return prev\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Detect cycle (Floyd)</summary>
              <CodeBlock code={`def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Middle node</summary>
              <CodeBlock code={`def middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow\n`} />
            </details>
          </section>

          {/* Trees */}
          <section id="trees" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Binary Trees</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">DFS traversals (iterative inorder)</summary>
              <CodeBlock code={`def inorder(root):\n    res, st, cur = [], [], root\n    while cur or st:\n        while cur:\n            st.append(cur)\n            cur = cur.left\n        cur = st.pop()\n        res.append(cur.val)\n        cur = cur.right\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Level order (BFS by level)</summary>
              <CodeBlock code={`from collections import deque\n\ndef level_order(root):\n    if not root: return []\n    q, out = deque([root]), []\n    while q:\n        lvl = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            lvl.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        out.append(lvl)\n    return out\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">LCA in binary tree</summary>
              <CodeBlock code={`def lowestCommonAncestor(root, p, q):\n    if not root or root is p or root is q:\n        return root\n    L = lowestCommonAncestor(root.left, p, q)\n    R = lowestCommonAncestor(root.right, p, q)\n    return root if L and R else (L or R)\n`} />
            </details>
          </section>

          {/* Trie */}
          <section id="trie" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Trie</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Prefix tree (insert/search)</summary>
              <CodeBlock code={`class TrieNode:\n    __slots__ = (\"children\", \"end\")\n    def __init__(self):\n        self.children = {}\n        self.end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, TrieNode())\n        node.end = True\n    def search(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.end\n    def startsWith(self, prefix):\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True\n`} />
            </details>
          </section>

          {/* Graphs */}
          <section id="graphs" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Graphs</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Adjacency list & DFS</summary>
              <CodeBlock code={`import sys\nsys.setrecursionlimit(10**6)\n\nn = 5\nadj = [[] for _ in range(n)]\n# adj[u].append(v)\n\nvisited = [False] * n\n\ndef dfs(u):\n    visited[u] = True\n    for v in adj[u]:\n        if not visited[v]:\n            dfs(v)\n`} />
            </details>
          </section>

          {/* Union-Find */}
          <section id="union-find" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Union‑Find (Disjoint Set)</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Path compression + union by rank</summary>
              <CodeBlock code={`class DSU:\n    def __init__(self, n):\n        self.p = list(range(n))\n        self.r = [0] * n\n        self.count = n\n    def find(self, x):\n        while self.p[x] != x:\n            self.p[x] = self.p[self.p[x]]\n            x = self.p[x]\n        return x\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False\n        if self.r[ra] < self.r[rb]:\n            ra, rb = rb, ra\n        self.p[rb] = ra\n        if self.r[ra] == self.r[rb]:\n            self.r[ra] += 1\n        self.count -= 1\n        return True\n`} />
            </details>
          </section>

          {/* Toposort */}
          <section id="toposort" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Topological Sort</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Kahn’s algorithm (BFS)</summary>
              <CodeBlock code={`from collections import deque\n\ndef topo_kahn(n, adj):\n    indeg = [0] * n\n    for u in range(n):\n        for v in adj[u]:\n            indeg[v] += 1\n    q = deque([u for u in range(n) if indeg[u] == 0])\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in adj[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n    return order if len(order) == n else []  # empty ⇒ cycle\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Cycle detection (DFS colors)</summary>
              <CodeBlock code={`def has_cycle(n, adj):\n    WHITE, GRAY, BLACK = 0, 1, 2\n    state = [WHITE] * n\n    def dfs(u):\n        state[u] = GRAY\n        for v in adj[u]:\n            if state[v] == GRAY:\n                return True\n            if state[v] == WHITE and dfs(v):\n                return True\n        state[u] = BLACK\n        return False\n    return any(dfs(u) for u in range(n) if state[u] == WHITE)\n`} />
            </details>
          </section>

          {/* Dijkstra */}
          <section id="dijkstra" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Dijkstra (shortest paths, ≥0 weights)</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Binary‑heap implementation</summary>
              <CodeBlock code={`import heapq\n\ndef dijkstra(n, adj, src):\n    INF = 10**18\n    dist = [INF] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d != dist[u]:\n            continue\n        for v, w in adj[u]:\n            nd = d + w\n            if nd < dist[v]:\n                dist[v] = nd\n                heapq.heappush(pq, (nd, v))\n    return dist\n`} />
            </details>
          </section>

          {/* Intervals */}
          <section id="intervals" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Intervals</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Merge intervals</summary>
              <CodeBlock code={`def merge_intervals(iv):\n    if not iv: return []\n    iv.sort()\n    res = []\n    for s, e in iv:\n        if not res or s > res[-1][1]:\n            res.append([s, e])\n        else:\n            res[-1][1] = max(res[-1][1], e)\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Insert interval</summary>
              <CodeBlock code={`def insert_interval(iv, new):\n    s, e = new\n    res, i, n = [], 0, len(iv)\n    while i < n and iv[i][1] < s:\n        res.append(iv[i]); i += 1\n    while i < n and iv[i][0] <= e:\n        s = min(s, iv[i][0])\n        e = max(e, iv[i][1])\n        i += 1\n    res.append([s, e])\n    res.extend(iv[i:])\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Sweep‑line (max overlaps)</summary>
              <CodeBlock code={`def max_overlap(iv):\n    ev = []\n    for s, e in iv:\n        ev.append((s, 1))\n        ev.append((e, -1))  # treat end as open; use (e+eps, -1) if closed\n    ev.sort()\n    cur = best = 0\n    for _, d in ev:\n        cur += d\n        best = max(best, cur)\n    return best\n`} />
            </details>
          </section>

          {/* Grid */}
          <section id="grid" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Grids / Flood‑Fill</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">DFS/BFS on 2D grid</summary>
              <CodeBlock code={`DIR4 = [(1,0), (-1,0), (0,1), (0,-1)]\n\ndef in_bounds(r, c, R, C):\n    return 0 <= r < R and 0 <= c < C\n\ndef num_islands(grid):\n    R, C = len(grid), len(grid[0])\n    seen = [[False]*C for _ in range(R)]\n    def dfs(r, c):\n        seen[r][c] = True\n        for dr, dc in DIR4:\n            nr, nc = r + dr, c + dc\n            if in_bounds(nr, nc, R, C) and not seen[nr][nc] and grid[nr][nc] == '1':\n                dfs(nr, nc)\n    count = 0\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == '1' and not seen[r][c]:\n                count += 1\n                dfs(r, c)\n    return count\n`} />
            </details>
          </section>

          {/* DP */}
          <section id="dp" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Dynamic Programming</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">1D coin change (min coins)</summary>
              <CodeBlock code={`def coinChange(coins, amount):\n    INF = 10**9\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return -1 if dp[amount] == INF else dp[amount]\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">0/1 knapsack (space‑opt)</summary>
              <CodeBlock code={`def knapsack_01(weights, values, W):\n    dp = [0] * (W + 1)\n    for w, v in zip(weights, values):\n        for cap in range(W, w - 1, -1):\n            dp[cap] = max(dp[cap], dp[cap - w] + v)\n    return dp[W]\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">LIS O(n log n)</summary>
              <CodeBlock code={`import bisect\n\ndef lis(nums):\n    tails = []\n    for x in nums:\n        i = bisect.bisect_left(tails, x)\n        if i == len(tails):\n            tails.append(x)\n        else:\n            tails[i] = x\n    return len(tails)\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">LCS (length)</summary>
              <CodeBlock code={`def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m-1, -1, -1):\n        for j in range(n-1, -1, -1):\n            dp[i][j] = dp[i+1][j+1] + 1 if a[i] == b[j] else max(dp[i+1][j], dp[i][j+1])\n    return dp[0][0]\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Edit distance</summary>
              <CodeBlock code={`def edit_distance(a, b):\n    m, n = len(a), len(b)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1):\n        dp[i][0] = i\n    for j in range(n+1):\n        dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            cost = 0 if a[i-1] == b[j-1] else 1\n            dp[i][j] = min(\n                dp[i-1][j] + 1,\n                dp[i][j-1] + 1,\n                dp[i-1][j-1] + cost,\n            )\n    return dp[m][n]\n`} />
            </details>
          </section>

          {/* Backtracking */}
          <section id="backtracking" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Backtracking</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Subsets</summary>
              <CodeBlock code={`def subsets(nums):\n    res, cur = [], []\n    def dfs(i):\n        if i == len(nums):\n            res.append(cur[:])\n            return\n        dfs(i+1)\n        cur.append(nums[i])\n        dfs(i+1)\n        cur.pop()\n    dfs(0)\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Permutations</summary>
              <CodeBlock code={`def permute(nums):\n    res, cur = [], []\n    used = [False] * len(nums)\n    def dfs():\n        if len(cur) == len(nums):\n            res.append(cur[:])\n            return\n        for i, x in enumerate(nums):\n            if used[i]:\n                continue\n            used[i] = True\n            cur.append(x)\n            dfs()\n            cur.pop()\n            used[i] = False\n    dfs()\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Combinations (n choose k)</summary>
              <CodeBlock code={`def combine(n, k):\n    res, cur = [], []\n    def dfs(x):\n        if len(cur) == k:\n            res.append(cur[:])\n            return\n        for v in range(x, n+1):\n            if k - len(cur) > n - v + 1:\n                break\n            cur.append(v)\n            dfs(v+1)\n            cur.pop()\n    dfs(1)\n    return res\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">N‑Queens</summary>
              <CodeBlock code={`def solveNQueens(n):\n    res, cols, d1, d2, cur = [], set(), set(), set(), []\n    def dfs(r):\n        if r == n:\n            res.append(['.'*c + 'Q' + '.'*(n-c-1) for c in cur])\n            return\n        for c in range(n):\n            if c in cols or r-c in d1 or r+c in d2:\n                continue\n            cols.add(c); d1.add(r-c); d2.add(r+c); cur.append(c)\n            dfs(r+1)\n            cur.pop(); cols.remove(c); d1.remove(r-c); d2.remove(r+c)\n    dfs(0)\n    return res\n`} />
            </details>
          </section>

          {/* Bit Tricks */}
          <section id="bit" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Bit Manipulation</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Lowbit / subset iteration</summary>
              <CodeBlock code={`def lowbit(x):\n    return x & -x\n\n# iterate all non-empty submasks of mask\ns = mask\nwhile s:\n    # use s\n    s = (s - 1) & mask\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Popcount</summary>
              <CodeBlock code={`x.bit_count()  # Python 3.8+\n# or: bin(x).count('1')\n`} />
            </details>
          </section>

          {/* Fenwick / Segment Tree */}
          <section id="fenwick" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Fenwick Tree / Segment Tree</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Fenwick (BIT)</summary>
              <CodeBlock code={`class BIT:\n    def __init__(self, n):\n        self.n = n\n        self.bit = [0] * (n + 1)\n    def add(self, i, delta):\n        while i <= self.n:\n            self.bit[i] += delta\n            i += i & -i\n    def sum(self, i):\n        s = 0\n        while i > 0:\n            s += self.bit[i]\n            i -= i & -i\n        return s\n    def range_sum(self, l, r):\n        return self.sum(r) - self.sum(l-1)\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Segment tree (iterative)</summary>
              <CodeBlock code={`class SegTree:\n    def __init__(self, arr, op=min, default=float('inf')):\n        n = 1\n        while n < len(arr):\n            n <<= 1\n        self.n, self.op, self.default = n, op, default\n        self.t = [default] * (2 * n)\n        self.t[n:n+len(arr)] = arr[:]\n        for i in range(n-1, 0, -1):\n            self.t[i] = op(self.t[2*i], self.t[2*i+1])\n    def update(self, i, val):\n        i += self.n\n        self.t[i] = val\n        i >>= 1\n        while i:\n            self.t[i] = self.op(self.t[2*i], self.t[2*i+1])\n            i >>= 1\n    def query(self, l, r):\n        resl = resr = self.default\n        l += self.n; r += self.n + 1\n        while l < r:\n            if l & 1:\n                resl = self.op(resl, self.t[l]); l += 1\n            if r & 1:\n                r -= 1; resr = self.op(self.t[r], resr)\n            l >>= 1; r >>= 1\n        return self.op(resl, resr)\n`} />
            </details>
          </section>

          {/* Math / Number Theory */}
          <section id="math" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Math / Number Theory</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">GCD / LCM / mod pow</summary>
              <CodeBlock code={`from math import gcd\n\ndef lcm(a, b):\n    return a // gcd(a, b) * b\n\npow(a, b, mod)  # fast modular exponentiation\n`} />
            </details>
            <details className="mt-2 rounded-xl border border-slate-800 p-3">
              <summary className="cursor-pointer font-semibold">Sieve of Eratosthenes</summary>
              <CodeBlock code={`def sieve(n):\n    prime = [True] * (n + 1)\n    if n >= 0: prime[0] = False\n    if n >= 1: prime[1] = False\n    for p in range(2, int(n ** 0.5) + 1):\n        if prime[p]:\n            start = p * p\n            step = p\n            prime[start:n+1:step] = [False] * (((n - start) // step) + 1)\n    return prime\n`} />
            </details>
          </section>

          {/* KMP */}
          <section id="kmp" data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">String: KMP (prefix function)</h2>
            <details className="rounded-xl border border-slate-800 p-3" open>
              <summary className="cursor-pointer font-semibold">Prefix table + search</summary>
              <CodeBlock code={`def kmp_table(p):\n    n, pi, j = len(p), [0]*len(p), 0\n    for i in range(1, n):\n        while j and p[i] != p[j]:\n            j = pi[j-1]\n        if p[i] == p[j]:\n            j += 1\n        pi[i] = j\n    return pi\n\ndef kmp_search(s, p):\n    pi, j = kmp_table(p), 0\n    for i, ch in enumerate(s):\n        while j and ch != p[j]:\n            j = pi[j-1]\n        if ch == p[j]:\n            j += 1\n            if j == len(p):\n                return i - j + 1\n    return -1\n`} />
            </details>
          </section>

          <section data-section className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-base font-semibold">Cheatsheet Usage Tips</h2>
            <ul className="list-disc pl-5 text-sm text-slate-300">
              <li>
                Use <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5">Ctrl/⌘+F</kbd> or the filter box to find patterns quickly.
              </li>
              <li>Most problems reduce to these templates + a small twist.</li>
              <li>Watch out for off‑by‑one and <code>None</code> edge cases on trees & lists.</li>
              <li>Prefer <code>@lru_cache</code> for recursion with overlapping subproblems.</li>
            </ul>
          </section>

          <p className="px-1 text-sm text-slate-400">Made for Python 3 on LeetCode. No external deps.</p>
        </div>
      </main>
    </div>
  )
}