# VVVV

**Visualizing Variants versus Vaccines** - A visualization of Canadian and American COVID-19 data; daily new cases, and first & final dose vaccination uptake.

## Usage

This project is hosted on [Vercel](https://vercel.com).

- 'Main' builds: [https://vvvv-main.vercel.app/](https://vvvv-main.vercel.app/)
- 'Development' builds: [https://vvvv-develop.vercel.app/](https://vvvv-develop.vercel.app/)

## Development

This is built with:
- [Next.js](https://nextjs.org/)
- [OpenCOVID API](https://opencovid.ca/) for Canadian data
- [Socrata API](https://www.tylertech.com/products/socrata) for American data

User-defined fields allow tweaking:
- the date range data is displayed over (both lower and upper bounds)
- a 'medium' and 'high' threshold for daily cases, above which graphs are highlighted accordingly

## Running Locally

Clone:
```bash
git clone https://github.com/bradendubois/vvvv
cd vvvv
```

Install dependencies:
```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributions, Bug Reports, & Contact

Any and all contributions, bug reports, and general feedback are welcome. 

Email: `braden.dubois@usask.ca`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

