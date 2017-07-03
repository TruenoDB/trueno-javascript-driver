<img src="https://snap.stanford.edu/images/snap_logo.png"/>

### Information
| Dataset | url         |
| ------- | ----------- |
| Twitter follower network  | https://snap.stanford.edu/data/twitter-2010.html  |

This is a network of follower relationships from a snapshot of Twitter in 2010. An edge from i to j indicates that j is a follower of i. As part of this dataset, we also include the Twitter ids of the users. Using TweeterID, one can map nodes to their Twitter handles if the account is public.

### Stats

Nodes: 41M (41.652.230)	<br>
Edges: 1.4B (1.468.364.884)

### Source (citation)
 * Haewoon Kwak, et al. "What is Twitter, a social network or a news media?." Proceedings of the 19th international conference on World wide web. ACM, 2010.
 * Paolo Boldi and Sebastiano Vigna. "The webgraph framework I: compression techniques." Proceedings of the 13th international conference on World Wide Web. ACM, 2004.
 * Paolo Boldi, et al. "Layered label propagation: A multiresolution coordinate-free ordering for compressing social networks." Proceedings of the 20th international conference on World Wide Web. ACM, 2011.

### Preprocess

```
split -l 200000 -a 4 -d ../twitter-2010.txt edges-
split -l 200000 -a 4 -d ../twitter-2010-ids.csv vertices-
```
