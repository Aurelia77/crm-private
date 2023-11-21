
// // import {render, screen, fireEvent} from '@testing-library/react'
// // import userEvent from '@testing-library/user-event'


// // import "@testing-library/jest-dom";
// // import { fireEvent, render, screen } from "@testing-library/react";
// // import Home from '../app/page'
// // import { describe, it } from "node:test";
// // // import { describe, expect, test } from '@jest/globals';


// // describe('Home', () => {
// //     it('renders buttons', () => {
// //         render(<Home />)
// //         const button = screen.getByText('Contacts')
// //         expect(button).toBeInTheDocument()
// //     })
// // })

// // LAYOUTChat copilot
import { render, screen } from '@testing-library/react';
import RootLayout from '../app/layout';
import Home from '../app/page'

import { ThemeProvider, createTheme } from "@mui/material/styles";

import MuiProviders from '../app/Components/MuiProviders';

describe('RootLayout', () => {
  test('renders children correctly', () => {
    const testId = 'child-component';
    render(
        <RootLayout>
          <div data-testid={testId}>Test Child</div>
        </RootLayout>
        ,{
        wrapper: MuiProviders
      }
    );
    const childComponent = screen.getByTestId(testId);
    expect(childComponent).toBeInTheDocument();
  });
});

describe('Home', () => {
  test('renders Contacts button', () => {
    render(
      // <Home />
      // , { wrapper: MuiProviders }
      <MuiProviders>
        <Home />
      </MuiProviders>

    );
    const linkElement = screen.getByText(/Contacts/i);
    expect(linkElement).toBeInTheDocument();
  });
});


// import { render, screen } from '@testing-library/react';
// import RootLayout from '../app/layout'; // Assurez-vous que le chemin d'accès est correct

// describe('RootLayout', () => {
//   test('renders children correctly', () => {
//     const testId = 'child-component';
//     render(
//       <RootLayout>
//         <div data-testid={testId}>Test Child</div>
//       </RootLayout>
//     );
//     const childComponent = screen.getByTestId(testId);
//     expect(childComponent).toBeInTheDocument();
//   });
// });


// // Chat copilot
// import { render, screen } from '@testing-library/react';
// import { ThemeProvider } from '@mui/material/styles';
// import UserAuthContextProvider from '../app/context/UseAuthContext';
// import Home from '../app/page'
// import { muiTheme } from '../app/layout'; 

// describe('Home page', () => {
//   test('renders correctly', () => {
//     render(
//       <ThemeProvider theme={muiTheme}>
//         <UserAuthContextProvider>
//           <Home />
//         </UserAuthContextProvider>
//       </ThemeProvider>
//     );
//     // Vos assertions de test vont ici
//   });

//   test('renders Contacts button', () => {
//     render(
//       <ThemeProvider theme={muiTheme}>
//       <UserAuthContextProvider>
//         <Home />
//       </UserAuthContextProvider>
//       </ThemeProvider>
//     );
//     const linkElement = screen.getByText(/Contacts/i);
//     expect(linkElement).toBeInTheDocument();
//   });
// });



// // Chat copilot
// //import '@testing-library/jest-dom/extend-expect';
// //import '@testing-library/jest-dom'

// import { render, screen } from '@testing-library/react';
// import Home from '../app/page'

// describe('Home page', () => {
//   test('renders Contacts button', () => {
//     render(<Home />);
//     const linkElement = screen.getByText(/Contacts/i);
//     expect(linkElement).toBeInTheDocument();
//     // Pour le pas avoir l'erreur sur toBeInTheDocument (pbm TS mais les tests fonctionnent qd même) => créer un fichier jest.d.ts dans type avec => import '@testing-library/jest-dom';
//   });
// });


// VIDEO https://www.youtube.com/watch?v=AS79oJ3Fcf0&ab_channel=DaveGray

// import "@testing-library/jest-dom";       // Normalement pas besoin !!! Déjà (presq) dans fichier jest.setup.js
// import { render, screen } from '@testing-library/react'
// import Home from '../app/page'

// describe('Home', () => {
//     it('Should have Contacts text', () => {
//         render(<Home />)    // ARRANGE

//         const myElement = screen.getByText('Contacts') // ACT
        
//         expect(myElement).toBeInTheDocument() // ASSERT
//     })
//     // it('Should have contacts text', () => {
//     //     render(<Home />)    // ARRANGE

//     //     const myElement = screen.getByText('contacts') // ACT
        
//     //     expect(myElement).toBeInTheDocument() // ASSERT
//     // })
// })



// // Test en boite noir        MIKE
// // 🚀 userEvent
// // http://localhost:3000/alone/final/01.js
// import * as React from 'react'
// import Hello from '../app/Components/helloreset'
// import {render, screen} from '@testing-library/react'
// import userEvent from '@testing-library/user-event'

// // Exo 2
// test('Affiche "Bonjour John" et "Merci" lors d\'un click" ', () => {
//     const {container} = render(<Hello name="John" />)
//     const envoyer = container.querySelector('input')
//     const label = container.firstChild.querySelector('div')
  
//     expect(label).toHaveTextContent(`Bonjour John`)
//     fireEvent.click(envoyer)
//     expect(label).toHaveTextContent(`Merci`)
//   })

// Exo 3
// test('Affiche "Bonjour John" et "Merci" lors d\'un click" ', () => {
//   render(<Hello name="John" />)
//   const envoyer = screen.getByRole('button', {name: /envoyer/i})
//   const reset = screen.getByRole('button', {name: /reset/i})
//   const label = screen.getByRole('status')

//   expect(label).toHaveTextContent(`Bonjour John`)
//   userEvent.click(envoyer)
//   expect(label).toHaveTextContent(`Merci`)
//   userEvent.click(reset)
//   expect(label).toHaveTextContent(`Bonjour John`)
// })




// // Chat copilot
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import Page from '../app/page'

// describe('Page', () => {
//   it('should update filteredContacts when contactsSearchCriteria changes', async () => {
//     const { getByLabelText, getByText } = render(<Page />);

//     // Simulate changing the search criteria
//     fireEvent.change(getByLabelText('Search'), { target: { value: 'new criteria' } });

//     // Wait for the component to update
//     await waitFor(() => getByText('expected result'));

//     // Check that the component updated correctly
//     expect(getByText('expected result')).toBeInTheDocument();
//   });

//   it('should set filteredContacts to contacts when contactsSearchCriteria is empty', async () => {
//     const { getByLabelText, getByText } = render(<Page />);

//     // Simulate clearing the search criteria
//     fireEvent.change(getByLabelText('Search'), { target: { value: '' } });

//     // Wait for the component to update
//     await waitFor(() => getByText('expected result'));

//     // Check that the component updated correctly
//     expect(getByText('expected result')).toBeInTheDocument();
//   });
// });