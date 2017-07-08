# Citation dataset

Arxiv HEP-TH (high energy physics theory) citation graph is from the e-print arXiv and covers all the citations within a dataset of 27,770 papers with 352,807 edges. If a paper i cites paper j, the graph contains a directed edge from i to j. If a paper cites, or is cited by, a paper outside the dataset, the graph does not contain any information about this.

The data covers papers in the period from January 1993 to April 2003 (124 months). It begins within a few months of the inception of the arXiv, and thus represents essentially the complete history of its HEP-TH section.

## Applications

### High energy physics citation network analysis

We implemented a wrapper (i.e. GraphX algorithms wrapper) integrated with TruenoDB's Web UI. In this application, we analyze the citations SNAP dataset. First, we built a personalized PageRank algorithm to obtain a rank relative to the "source" node (e.g. Vs) in the graph **G**. We were able to find the most important paper from the perspective of the source paper (i.e. Vs). 
* We obtained the top ranked node (e.g. via PageRank algorithm we got MAPT). 
* We found the most important paper ("An algorithm to generate classical solutions for string effective action") from the top ranked paper point of view.

## References
* [1] https://snap.stanford.edu/data/cit-HepTh.html
