﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by AsyncGenerator.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


using System;
using System.Collections;
using System.Data;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Xml.Serialization;
using NHibernate.Driver;
using NHibernate.Type;
using NHibernate.Util;
using NUnit.Framework;

namespace NHibernate.Test.NHSpecificTest.Dates
{
	using System.Threading.Tasks;
	using System.Threading;
	[TestFixture]
	public class DateTimeOffsetFixtureAsync : FixtureBaseAsync
	{
		protected override string[] Mappings
		{
			get { return new[] { "NHSpecificTest.Dates.Mappings.DateTimeOffset.hbm.xml" }; }
		}

		protected override bool AppliesTo(Engine.ISessionFactoryImplementor factory)
		{
			// Cannot handle DbType.DateTimeOffset via ODBC.
			if (factory.ConnectionProvider.Driver is OdbcDriver)
				return false;

			return base.AppliesTo(factory);
		}

		protected override DbType? AppliesTo()
		{
			return DbType.DateTimeOffset;
		}

		protected virtual long DateAccuracyInTicks => Dialect.TimestampResolutionInTicks;

		[Test]
		public async Task SavingAndRetrievingTestAsync()
		{
			var NowOS = DateTimeOffsetType.Round(DateTimeOffset.Now, DateAccuracyInTicks);

			AllDates dates = new AllDates { Sql_datetimeoffset = NowOS };

			using (ISession s = OpenSession())
			using (ITransaction tx = s.BeginTransaction())
			{
				await (s.SaveAsync(dates));
				await (tx.CommitAsync());
			}

			using (ISession s = OpenSession())
			using (ITransaction tx = s.BeginTransaction())
			{
				var datesRecovered = await (s.CreateQuery("from AllDates").UniqueResultAsync<AllDates>());
				Assert.That(datesRecovered.Sql_datetimeoffset, Is.EqualTo(NowOS));
			}

			using (ISession s = OpenSession())
			using (ITransaction tx = s.BeginTransaction())
			{
				var datesRecovered = await (s.CreateQuery("from AllDates").UniqueResultAsync<AllDates>());
				await (s.DeleteAsync(datesRecovered));
				await (tx.CommitAsync());
			}
		}

		[Test]
		public async Task NextAsync()
		{
			var type = NHibernateUtil.DateTimeOffset;
			var current = DateTimeOffset.Now.AddTicks(-1);
			object next = await (type.NextAsync(current, null, CancellationToken.None));

			Assert.That(next, Is.TypeOf<DateTimeOffset>().And.Property("Ticks").GreaterThan(current.Ticks));
		}

		[Test]
		public async Task SeedAsync()
		{
			var type = NHibernateUtil.DateTimeOffset;
			Assert.That(await (type.SeedAsync(null, CancellationToken.None)), Is.TypeOf<DateTimeOffset>());
		}
	}
}