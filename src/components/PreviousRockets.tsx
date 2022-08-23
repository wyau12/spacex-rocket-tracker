import { useQuery } from "@apollo/client";
import { Box, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ASC_ORDER, DESC_ORDER } from "../constants";
import { GET_ROCKETS } from "../graphql";
import { Rocket } from "../models";

// Assumption made: Previous rockets are non-active rockets
function PreviousRockets() {
  let [previousRockets, setPreviousRockets] = useState<Rocket[]>([]);
  let [filteredPreviousRockets, setFilteredPreviousRockets] = useState<Rocket[]>([]);
  let [nameSort, setNameSort] = useState<typeof ASC_ORDER | typeof DESC_ORDER | false>(false);
  let [filterText, setFilterText] = useState('');
  
  const onFilterTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value?.toLowerCase());
  }, []);

  const onNameSortClick = useCallback(() => {
    switch(nameSort) {
      case ASC_ORDER:
        setNameSort(DESC_ORDER);
        break;
      case DESC_ORDER:
        setNameSort(false);
        break;
      default:
        setNameSort(ASC_ORDER);
        break;
    }
  }, [nameSort]);

  const { loading, error, data } = useQuery(GET_ROCKETS);

  useEffect(() => {
    if (data?.rockets.length) {
      const rockets = data.rockets.filter((rocket: Rocket) => !rocket.active);
      setPreviousRockets(rockets);
      setFilteredPreviousRockets(rockets);
    } else {
      setPreviousRockets([]);
      setFilteredPreviousRockets([]);
    }
  }, [data?.rockets]);

  useEffect(() => {
    let searchResult = previousRockets;
    if (filterText.trim()) {
      searchResult = searchResult.filter(rocket => {
        return rocket.name.toLowerCase().includes(filterText) || rocket.type.toLowerCase().includes(filterText)
          || rocket.engines?.type.toLowerCase().includes(filterText) || rocket.description.toLowerCase().includes(filterText)
          || rocket.company.toLowerCase().includes(filterText) || rocket.country.toLowerCase().includes(filterText)
          || rocket.boosters.toString().includes(filterText) || rocket.stages.toString().includes(filterText) || rocket.firstFlightDate.includes(filterText)
          || rocket.costPerLaunch.toString().includes(filterText) || rocket.successRatePercent.toString().includes(filterText)
          || rocket.wikipedia.toLowerCase().includes(filterText);
      });
    }
    
    setFilteredPreviousRockets(searchResult);
  }, [previousRockets, filterText, nameSort]);

  const sortedRocketList = useMemo(() => {
    if (nameSort === DESC_ORDER) {
      return filteredPreviousRockets.sort((rocket1, rocket2) => rocket1.name > rocket2.name ? -1 : 1);
    } 
    
    return filteredPreviousRockets.sort((rocket1, rocket2) => rocket1.name < rocket2.name ? -1 : 1);
  }, [filteredPreviousRockets, nameSort]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!!!</p>;

  return (
    <>
      <Input
        placeholder="Filter Text"
        value={filterText}
        onChange={onFilterTextChange}
      ></Input>
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={nameSort}>
                <TableSortLabel
                  active={nameSort !== false}
                  direction={nameSort === ASC_ORDER ? ASC_ORDER : DESC_ORDER}
                  onClick={onNameSortClick}
                  data-testid='name-sort-cell'
                >
                  Name
                  {nameSort ? (
                    <Box component="span" sx={visuallyHidden}>
                      { nameSort === DESC_ORDER ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Engine Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Country</TableCell>
              <TableCell># Boosters</TableCell>
              <TableCell># Stages</TableCell>
              <TableCell>First Flight Date</TableCell>
              <TableCell>Cost Per Launch</TableCell>
              <TableCell>Success Rate Percentage</TableCell>
              <TableCell>Wikipedia URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid='table-body'>
            {
              sortedRocketList.map(previousRocket => (
                <TableRow key={previousRocket.id} data-testid={previousRocket.id}>
                  <TableCell>{previousRocket.name}</TableCell>
                  <TableCell>{previousRocket.type}</TableCell>
                  <TableCell>{previousRocket.engines?.type}</TableCell>
                  <TableCell>{previousRocket.description}</TableCell>
                  <TableCell>{previousRocket.company}</TableCell>
                  <TableCell>{previousRocket.country}</TableCell>
                  <TableCell>{previousRocket.boosters}</TableCell>
                  <TableCell>{previousRocket.stages}</TableCell>
                  <TableCell>{previousRocket.firstFlightDate}</TableCell>
                  <TableCell>{previousRocket.costPerLaunch}</TableCell>
                  <TableCell>{previousRocket.successRatePercent}</TableCell>
                  <TableCell><a href={previousRocket.wikipedia}>{previousRocket.wikipedia}</a></TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PreviousRockets;
