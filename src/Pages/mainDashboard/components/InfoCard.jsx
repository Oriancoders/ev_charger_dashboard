// src/components/InfoCard.jsx

const InfoCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[24px] font-bold  text-[#1E1E2F] italic">{title}</h3>
            <p className="text-lg text-[#AFAFAF]">Total {title.toLowerCase()} supplied</p>
          </div>
          <span className="text-2xl text-[#0A86F0]">{icon}</span>
        </div>
        <p className="text-[18px] font-semibold mt-3 text-[#1E1E2F]"><i>{value}</i></p>
      </div>
    );
  };
  
  export default InfoCard;
  