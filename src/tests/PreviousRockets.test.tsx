import { fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PreviousRockets } from '../components';
import { GET_ROCKETS } from '../graphql';
import { DocumentNode } from '@apollo/client';
import { Rocket } from '../models';


const mocks: {
  request: {
    query: DocumentNode;
  },
  result: {
    data: {
      rockets: Rocket[];
    },
  }
}[] = [
  {
    request: {
      query: GET_ROCKETS,
    },
    result: {
      data: {
        rockets: [
          {
            id: 'rocket1',
            name: 'rocket 1',
            type: 'a rocket',
            engines: {
              type: 'engine 1',
            },
            description: 'it is rocket 1',
            company: 'spacex parent',
            country: 'usa',
            boosters: 2,
            stages: 3,
            firstFlightDate: '2021-02-02',
            costPerLaunch: 123000000,
            successRatePercent: 20,
            wikipedia: 'http://wiki.com/rocket1',
            active: false,
          },
          {
            id: 'rocket2',
            name: 'rocket 2',
            type: 'b rocket',
            engines: {
              type: 'engine 2',
            },
            description: 'it is rocket 2',
            company: 'spacex child',
            country: 'canada',
            boosters: 4,
            stages: 6,
            firstFlightDate: '2021-10-05',
            costPerLaunch: 456000000,
            successRatePercent: 21,
            wikipedia: 'http://wiki.com/rocket2',
            active: false,
          },
          {
            id: 'rocket3',
            name: 'rocket 3',
            type: 'c rocket',
            engines: {
              type: 'engine 3',
            },
            description: 'it is rocket 3',
            company: 'spacex child',
            country: 'mexico',
            boosters: 5,
            stages: 1,
            firstFlightDate: '2020-03-11',
            costPerLaunch: 112000000,
            successRatePercent: 54,
            wikipedia: 'http://wiki.com/rocket3',
            active: true,
          },
        ],
      },
    },
  },
];

test(`filters table based on Filter Text field`, async () => {
  render((
    <MockedProvider mocks={mocks}>
      <PreviousRockets />
    </MockedProvider>
  ));

  const initialTableRowsWithNoFilter = await screen.findAllByTestId('rocket', { exact: false });
  expect(initialTableRowsWithNoFilter.length).toEqual(2);
  expect(initialTableRowsWithNoFilter[0].firstChild?.textContent).toBe('rocket 1');
  expect(initialTableRowsWithNoFilter[1].firstChild?.textContent).toBe('rocket 2');
  
  const filterTextField = await screen.findByPlaceholderText('Filter Text');
  fireEvent.change(filterTextField, {target: {value: 'rocket 2'}});

  const filteredTableRows = await screen.findAllByTestId('rocket', { exact: false });
  expect(filteredTableRows.length).toEqual(1);
  expect(filteredTableRows[0].firstChild?.textContent).toBe('rocket 2');
});
