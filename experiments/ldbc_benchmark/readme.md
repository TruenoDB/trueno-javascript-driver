# LDBC dataset

The LDBC-SNB Data Generator (DATAGEN) is the responsible of providing the data sets used by all the LDBC benchmarks. This data generator is designed to produce directed labeled graphs that mimic the characteristics of those graphs of real data.

## Applications

### LDBC datasets network analysis

We implemented a wrapper (i.e. GraphX algorithms wrapper) integrated with TruenoDB's Web UI. In this application, we analyze the LDBC datasets. First, we generate the scale 1 and 10 for SNB and graphalytics. 
Then, we run computations (PageRank and connected Components) in the relationship "knows" of **persons** (i.e. we filtered **knows** relationships in the graph).
* We obtained the top ranked node. 
* We showed graph read/load and creation.

## References
* [1] https://github.com/ldbc/ldbc_snb_datagen
