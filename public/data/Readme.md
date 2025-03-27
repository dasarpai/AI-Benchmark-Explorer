# Readme 
After getting the final paperswithcode_dataset.csv, we need to do following cleaning.

- Deleted Column : subtask
- Cleaned column: year 
- Added column: benchmark_cnt
- Added column: associated_task_cnt

## Formula to create columns 
associated_task_cnt & 
benchmark_cnt

```
=LEN(D3) - LEN(SUBSTITUTE(D3, ",", ""))+IF(D3<>"",1,0)
```

## Prompt for app 
```
Create a clean and modern React-based web application named "AI Benchmark Explorer".

The app should display benchmark datasets scraped from Papers With Code in a searchable and filterable table or grid format.

Each dataset includes:
- dataset_name
- subtask
- task
- associated_tasks
- modalities
- languages
- area
- benchmark_urls
- license
- homepage_url
- pwc_url
- description
- year_published

Requirements:
1. Provide a search bar to filter datasets by name or keyword.
2. Add multi-select filters for:
   - Task
   - Modalities
   - Area
   - Year Published
3. Clicking on a dataset opens a modal or side panel showing detailed info and external links (homepage, pwc_url, etc.).
4. Responsive layout with clean UI using Tailwind CSS or Chakra UI.
5. Include a placeholder dataset for now; I will replace it with real data later.

Optional:
- Add basic dark mode support.
- Use local state (no backend needed).


```

## Further improvement in functionality

- benchmark_urls column has comma separated values, it has suffix of complete url. prefix that with https://paperswithcode.com/sota/ to create benchmarkurl. And show the benchmark url active link on detail page. 

Final link will be like this: https://paperswithcode.com/sota/unsupervised-anomaly-detection-on
 

- in the grid show two more colums benchmark_cnt, associated_task_cnt. I have updated the table.
