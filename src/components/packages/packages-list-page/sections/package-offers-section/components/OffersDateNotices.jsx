export default function OffersDateNotices({
  requiresStayDates,
  checkInDate,
  isPastOrTodaySelected,
  activeTab,
  overnightAvailableCount,
  daytourAvailableCount,
  cottagesAvailableCount,
}) {
  return (
    <>
      {requiresStayDates && !checkInDate ? (
        <p className="offersDateNotice">All offers are shown. Pick a check-in date to prioritize available options.</p>
      ) : null}

      {requiresStayDates && isPastOrTodaySelected ? (
        <p className="offersDateNotice">Check-in date must be a future date (starting tomorrow).</p>
      ) : null}

      {requiresStayDates && checkInDate && activeTab === 'overnight' && overnightAvailableCount === 0 ? (
        <p className="offersDateNotice">No overnight offers are available for the selected date. Unavailable offers are listed below.</p>
      ) : null}

      {requiresStayDates && checkInDate && activeTab === 'daytour' && daytourAvailableCount === 0 ? (
        <p className="offersDateNotice">No day tour offers are available for the selected date. Unavailable offers are listed below.</p>
      ) : null}

      {requiresStayDates && checkInDate && activeTab === 'daytour' && cottagesAvailableCount === 0 ? (
        <p className="offersDateNotice">No cottages are available for the selected date. Unavailable cottages are listed below.</p>
      ) : null}
    </>
  )
}
