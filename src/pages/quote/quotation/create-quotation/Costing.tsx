import { useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ButtonAtom from '../../../../atoms/ButtonAtom';
import DivAtom from '../../../../atoms/DivAtom';
import H2Atom from '../../../../atoms/H2Atom';
import IconAtom from '../../../../atoms/IconAtom';
import ParagraphAtom from '../../../../atoms/ParagraphAtom';
import { Hotels } from '../../../../hotels';
import CostingAccomodationTable from '../../../../organisms/quote/quotation/create-quotation/costing/CostingAccomodationTable';
import CostingOverallCost from '../../../../organisms/quote/quotation/create-quotation/costing/CostingOverallCost';
import CostingRateComparisonTable from '../../../../organisms/quote/quotation/create-quotation/costing/CostingRateComparisonTable';
import CostingTransport from '../../../../organisms/quote/quotation/create-quotation/costing/CostingTransport';
import { selectWith2NavbarHeight, selectWith2NavbarWidth } from '../../../../redux/containerSizeSlice';
import { fetchingDataIndicatorStyles, quoteCreateQuoteStyles } from '../../../../styles';
import {
  RAPID_API_KEY,
  widthHeightDynamicStyle,
  AGGREGATOR_BASE_URL,
  AGGREGATOR_HOST,
} from '../../../../utils/helpers';
import { UserAccomodation, QuotationCostingRate } from '../../../../utils/types';

function Costing() {
  const height = useSelector(selectWith2NavbarHeight);
  const width = useSelector(selectWith2NavbarWidth);

  // Overall cost
  const [totalExpense, setTotalExpense] = useState('');
  const [commission, setCommission] = useState('30%');
  const [totalPrice, setTotalPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('1000');
  const [discount, setDiscount] = useState('40');
  const [netPrice, setNetPrice] = useState('');

  // transport
  const [rate, setRate] = useState('60');
  const [days, setDays] = useState('6');
  const [transport, setTransport] = useState('0');

  // accomodation
  const [accomodationTotal, setAccomodationTotal] = useState('0');
  const [accomodationData, setAccomodationData] = useState<UserAccomodation[]>();

  // comparison
  const [comparisonData, setComparisonData] = useState<QuotationCostingRate[]>();

  const history = useHistory();

  useEffect(() => {
    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];
    const accomodations: UserAccomodation[] = JSON.parse(
      localStorage.getItem('New Quote Accomodation')!,
    ).selectedAccomodations;

    const getComparisonRates = async () => {
      const rates: QuotationCostingRate[] = [];
      await Promise.all(accomodations.map(async (acc) => {
        const totalGuests = customerDetails[10].length + Number(customerDetails[9]);
        const results = await axios.post(`${AGGREGATOR_BASE_URL}rates`, {
          hotelId: Hotels[acc.name as keyof typeof Hotels],
          checkIn: customerDetails[7],
          checkOut: customerDetails[8],
        }, {
          headers: {
            'X-RapidAPI-Host': AGGREGATOR_HOST,
            'X-RapidAPI-Key': RAPID_API_KEY,
          },
        });

        const requiredRates = results.data.rates?.filter((r: any) => (
          r.host.toLowerCase().includes('agoda') || r.host.toLowerCase().includes('booking')
          || r.host.toLowerCase().includes('tripadvisor') || r.host.toLowerCase() === 'hotels.com'
        ));

        requiredRates.forEach((r: any, i: number) => {
          rates.push({
            bookingEngine: r.host,
            accomodation: acc.name,
            id: String(i),
            rate: `$${(Number(r.rate) * totalGuests) + (Number(r.taxes) * totalGuests)}`,
          });
        });
      }));

      setComparisonData(rates);
    };

    getComparisonRates();
  }, []);

  useEffect(() => {
    const data: UserAccomodation[] = JSON.parse(
      localStorage.getItem('New Quote Accomodation')!,
    ).selectedAccomodations;

    let accTotal = 0;
    let transportDays = 0;
    data.forEach((acc) => {
      transportDays += Number(acc.nights);
      accTotal += Number(acc.total.slice(1, acc.total.length));
    });

    const transportTotal = Number(rate) * Number(days);
    const expenseTotal = Number(accTotal + transportTotal);
    const priceTotal = ((Number(commission.slice(0, commission.length - 1)) + 100) / 100)
      * expenseTotal;

    const netTotal = Number(sellingPrice) - Number(discount);

    setDays(String(transportDays + 1));
    setAccomodationTotal(String(accTotal));
    setTransport(String(transportTotal));
    setTotalExpense(String(expenseTotal));
    setTotalPrice(String(priceTotal));
    setNetPrice(String(netTotal));
    setAccomodationData(data);
  }, [rate, transport, totalExpense, commission, sellingPrice, discount]);

  const saveCost = () => {
    localStorage.setItem(
      'New Quote Costing',
      JSON.stringify({
        discount,
        netPrice,
        sellingPrice,
        totalExpense,
        commission,
        totalPrice,
        comparisonData,
        transportTotal: transport,
        transportRate: rate,
        transportDays: days,
      }),
    );

    history.replace('/quote/quotations/create/approval');
  };

  return (
    <DivAtom style={{ height: `${height}px` }}>
      <DivAtom style={quoteCreateQuoteStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={quoteCreateQuoteStyles.backBtn}
          onClick={() => history.replace('/quote/quotations/create/accomodation')}
        />
        <H2Atom style={quoteCreateQuoteStyles.title} text="Costing" />
      </DivAtom>

      {accomodationData && comparisonData ? (
        <>
          <ParagraphAtom
            style={{
              ...quoteCreateQuoteStyles.title,
              margin: '1rem 0 1rem 1rem',
            }}
            text="Rate Comparison"
          />
          <DivAtom style={quoteCreateQuoteStyles.tableContainer}>
            {comparisonData.length > 0 && (
              <CostingRateComparisonTable
                columns={[
                  'Accomodation',
                  'Booking Engine',
                  'Rate',
                ]}
                data={comparisonData}
              />
            )}
          </DivAtom>
          <ParagraphAtom
            style={{
              ...quoteCreateQuoteStyles.title,
              margin: '1rem 0 1rem 1rem',
            }}
            text="Accomodation"
          />
          <DivAtom style={quoteCreateQuoteStyles.tableContainer}>
            {accomodationData.length > 0 && (
              <>
                <CostingAccomodationTable
                  columns={[
                    'LOCATION',
                    'NIGHTS',
                    'ACCOMODATION',
                    'PAX',
                    'ROOM TYPE',
                    'MEAL PLAN',
                    'ROOM RATE',
                    'TOTAL',
                  ]}
                  accTotal={accomodationTotal}
                  data={accomodationData}
                />
              </>
            )}
          </DivAtom>
          <ParagraphAtom
            style={{
              ...quoteCreateQuoteStyles.title,
              margin: '1rem 0 1rem 1rem',
            }}
            text="Transporation"
          />
          <CostingTransport
            width={width}
            rate={rate}
            days={days}
            transport={transport}
            setRate={setRate}
            setDays={setDays}
            setTransport={setTransport}
          />
          <DivAtom style={quoteCreateQuoteStyles.tableContainer}>
            <hr />
          </DivAtom>
          <CostingOverallCost
            width={width}
            totalExpense={totalExpense}
            commission={commission}
            totalPrice={totalPrice}
            sellingPrice={sellingPrice}
            discount={discount}
            netPrice={netPrice}
            setTotalExpense={setTotalExpense}
            setCommission={setCommission}
            setTotalPrice={setTotalPrice}
            setSellingPrice={setSellingPrice}
            setDiscount={setDiscount}
            setNetPrice={setNetPrice}
          />
          <DivAtom
            style={{
              ...quoteCreateQuoteStyles.addBtnContainer,
              padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
              margin: widthHeightDynamicStyle(
                width,
                768,
                0,
                quoteCreateQuoteStyles.addBtnContainer.margin,
              ),
            }}
          >
            <ButtonAtom
              size="large"
              text="Save"
              onClick={saveCost}
              style={{
                ...quoteCreateQuoteStyles.addBtn,
                width: widthHeightDynamicStyle(width, 768, '100%', '12%'),
                margin: '0 0 1rem 0',
              }}
            />
          </DivAtom>
        </>
      ) : (
        <DivAtom style={fetchingDataIndicatorStyles.container}>
          <CircularProgress size={20} color="primary" />
        </DivAtom>
      )}
    </DivAtom>
  );
}

export default Costing;
