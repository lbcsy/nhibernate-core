﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by AsyncGenerator.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using NHibernate.AdoNet;
using NHibernate.Cfg;
using NHibernate.Driver;
using NHibernate.Engine;
using NHibernate.SqlCommand;
using NHibernate.SqlTypes;
using NHibernate.Tool.hbm2ddl;
using NHibernate.Type;
using NHibernate.Util;
using NUnit.Framework;

namespace NHibernate.Test.TypesTest
{
	using System.Threading.Tasks;
	using System.Threading;
	[TestFixture]
	public abstract class AbstractDateTimeTypeFixtureAsync : TypeFixtureBase
	{
		protected abstract AbstractDateTimeType Type { get; }
		protected virtual bool RevisionCheck => true;

		protected const int DateId = 1;
		protected const int AdditionalDateId = 2;

		protected override void Configure(Configuration configuration)
		{
			base.Configure(configuration);

			var driverClass = ReflectHelper.ClassForName(configuration.GetProperty(Cfg.Environment.ConnectionDriver));
			ClientDriverWithParamsStats.DriverClass = driverClass;

			configuration.SetProperty(
				Cfg.Environment.ConnectionDriver,
				typeof(ClientDriverWithParamsStats).AssemblyQualifiedName);
		}

		protected override void OnSetUp()
		{
			base.OnSetUp();

			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				var d = new DateTimeClass
				{
					Id = DateId,
					Value = Now
				};
				s.Save(d);
				t.Commit();
			}
		}

		protected override void OnTearDown()
		{
			base.OnTearDown();

			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				s.CreateQuery("delete from DateTimeClass").ExecuteUpdate();
				t.Commit();
			}
		}

		protected override void DropSchema()
		{
			(Sfi.ConnectionProvider.Driver as ClientDriverWithParamsStats)?.CleanUp();
			base.DropSchema();
		}

		[Test]
		public async Task NextAsync()
		{
			// Take some margin, as DbTimestampType takes its next value from the database, which
			// may have its clock a bit shifted even if running on the same server. (Seen with PostgreSQL,
			// off by a few seconds, and with SAP HANA running in a vm, off by twenty seconds.)
			var current = Now.Subtract(TimeSpan.FromMinutes(2));
			var next = await (Type.NextAsync(current, null, CancellationToken.None));

			Assert.That(next, Is.TypeOf<DateTime>(), "next should be DateTime");
			Assert.That(next, Is.GreaterThan(current), "next should be greater than current");
		}

		[Test]
		public async Task SeedAsync()
		{
			Assert.That(await (Type.SeedAsync(null, CancellationToken.None)), Is.TypeOf<DateTime>(), "seed should be DateTime");
		}

		[Test]
		public async Task ComparerAsync()
		{
			var v1 = await (Type.SeedAsync(null, CancellationToken.None));
			var v2 = Now.Subtract(TimeSpan.FromTicks(DateAccuracyInTicks));
			Assert.That(() => Type.Comparator.Compare(v1, v2), Throws.Nothing);
		}

		[Test]
		[TestCase(DateTimeKind.Unspecified)]
		[TestCase(DateTimeKind.Local)]
		[TestCase(DateTimeKind.Utc)]
		public async Task ReadWriteAsync(DateTimeKind kind)
		{
			var entity = new DateTimeClass
			{
				Id = AdditionalDateId,
				Value = GetTestDate(kind)
			};

			var typeKind = GetTypeKind();
			// Now must be acquired before transaction because some db freezes current_timestamp at transaction start,
			// like PostgreSQL. https://www.postgresql.org/docs/7.2/static/functions-datetime.html#AEN6700
			// This then wrecks tests with DbTimestampType if the always out of tran Now is called for fetching
			// beforeNow only after transaction start.
			// And account db accuracy
			var beforeNow = Now.AddTicks(-DateAccuracyInTicks);
			// Save
			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				await (s.SaveAsync(entity));
				if (kind != typeKind && typeKind != DateTimeKind.Unspecified)
				{
					Assert.That(() => t.CommitAsync(), Throws.TypeOf<PropertyValueException>());
					return;
				}
				await (t.CommitAsync());
			}
			var afterNow = Now.AddTicks(DateAccuracyInTicks);

			if (RevisionCheck)
			{
				Assert.That(entity.Revision, Is.GreaterThan(beforeNow).And.LessThan(afterNow), "Revision not correctly seeded.");
				if (typeKind != DateTimeKind.Unspecified)
					Assert.That(entity.Revision.Kind, Is.EqualTo(typeKind), "Revision kind not correctly seeded.");
				Assert.That(entity.NullableValue, Is.Null, "NullableValue unexpectedly seeded.");
			}

			// Retrieve, compare then update
			DateTimeClass retrieved;
			using (var s = OpenSession())
			{
				using (var t = s.BeginTransaction())
				{
					retrieved = await (s.GetAsync<DateTimeClass>(AdditionalDateId));

					Assert.That(retrieved, Is.Not.Null, "Entity not saved or cannot be retrieved by its key.");
					Assert.That(retrieved.Value, Is.EqualTo(GetExpectedValue(entity.Value)), "Unexpected value.");
					if (RevisionCheck)
						Assert.That(retrieved.Revision, Is.EqualTo(entity.Revision), "Revision should be the same.");
					Assert.That(retrieved.NullableValue, Is.EqualTo(entity.NullableValue), "NullableValue should be the same.");
					if (typeKind != DateTimeKind.Unspecified)
					{
						Assert.That(retrieved.Value.Kind, Is.EqualTo(typeKind), "Value kind not correctly retrieved.");
						if (RevisionCheck)
							Assert.That(retrieved.Revision.Kind, Is.EqualTo(typeKind), "Revision kind not correctly retrieved.");
					}
					await (t.CommitAsync());
				}
				beforeNow = Now.AddTicks(-DateAccuracyInTicks);
				using (var t = s.BeginTransaction())
				{
					retrieved.NullableValue = GetTestDate(kind);
					retrieved.Value = GetTestDate(kind).AddMonths(-1);
					await (t.CommitAsync());
				}
				afterNow = Now.AddTicks(DateAccuracyInTicks);
			}

			if (RevisionCheck)
			{
				Assert.That(
					retrieved.Revision,
					Is.GreaterThan(beforeNow).And.LessThan(afterNow).And.GreaterThanOrEqualTo(entity.Revision),
					"Revision not correctly incremented.");
				if (typeKind != DateTimeKind.Unspecified)
					Assert.That(retrieved.Revision.Kind, Is.EqualTo(typeKind), "Revision kind incorrectly changed.");
			}

			// Retrieve and compare again
			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				var retrievedAgain = await (s.GetAsync<DateTimeClass>(AdditionalDateId));

				Assert.That(retrievedAgain, Is.Not.Null, "Entity deleted or cannot be retrieved again by its key.");
				Assert.That(
					retrievedAgain.Value,
					Is.EqualTo(GetExpectedValue(retrieved.Value)),
					"Unexpected value at second compare.");
				if (RevisionCheck)
					Assert.That(retrievedAgain.Revision, Is.EqualTo(retrieved.Revision), "Revision should be the same again.");
				Assert.That(
					retrievedAgain.NullableValue,
					Is.EqualTo(GetExpectedValue(retrieved.NullableValue.Value)),
					"Unexpected NullableValue at second compare.");
				if (typeKind != DateTimeKind.Unspecified)
				{
					Assert.That(retrievedAgain.Value.Kind, Is.EqualTo(typeKind), "Value kind not correctly retrieved again.");
					if (RevisionCheck)
						Assert.That(retrievedAgain.Revision.Kind, Is.EqualTo(typeKind), "Revision kind not correctly retrieved again.");
					Assert.That(
						retrievedAgain.NullableValue.Value.Kind,
						Is.EqualTo(typeKind),
						"NullableValue kind not correctly retrieved again.");
				}
				await (t.CommitAsync());
			}
		}

		[Test]
		public async Task DbHasExpectedTypeAsync()
		{
			var validator = new SchemaValidator(cfg);
			await (validator.ValidateAsync());
		}

		[Test]
		public virtual async Task SaveUseExpectedSqlTypeAsync()
		{
			var driver = (ClientDriverWithParamsStats) Sfi.ConnectionProvider.Driver;

			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				var d = new DateTimeClass
				{
					Id = 2,
					Value = Now,
					NullableValue = Now
				};
				driver.ClearStats();
				await (s.SaveAsync(d));
				await (t.CommitAsync());
			}

			var expected = 3;
			// GenericBatchingBatcher uses IDriver.GenerateCommand method to create the batching command,
			// so the expected result will be doubled as GenerateCommand calls IDriver.GenerateParameter
			// for each parameter.
			if (Sfi.Settings.BatcherFactory is GenericBatchingBatcherFactory)
			{
				expected *= 2;
			}
			// 2 properties + revision
			AssertSqlType(driver, expected, true);
		}

		[Test]
		public virtual async Task UpdateUseExpectedSqlTypeAsync()
		{
			var driver = (ClientDriverWithParamsStats) Sfi.ConnectionProvider.Driver;

			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				var d = await (s.GetAsync<DateTimeClass>(DateId));
				d.Value = Now;
				d.NullableValue = Now;
				driver.ClearStats();
				await (t.CommitAsync());
			}

			// 2 properties + revision x 2 (check + update)
			AssertSqlType(driver, 4, true);
		}

		[Test]
		public virtual async Task QueryUseExpectedSqlTypeAsync()
		{
			if (!TestDialect.SupportsNonDataBoundCondition)
				Assert.Ignore("Dialect does not support the test query");

			var driver = (ClientDriverWithParamsStats) Sfi.ConnectionProvider.Driver;

			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				var q = s
					.CreateQuery(
						"from DateTimeClass d where d.Value = :value and " +
						"d.NullableValue = :nullableValue and " +
						"d.Revision = :revision and " +
						":other1 = :other2")
					.SetDateTime("value", Now)
					.SetDateTime("nullableValue", Now)
					.SetDateTime("revision", Now)
					.SetDateTime("other1", Now)
					.SetDateTime("other2", Now);
				driver.ClearStats();
				await (q.ListAsync<DateTimeClass>());
				await (t.CommitAsync());
			}

			AssertSqlType(driver, 5, false);

			using (var s = OpenSession())
			using (var t = s.BeginTransaction())
			{
				var q = s
					.CreateQuery(
						"from DateTimeClass d where d.Value = :value and " +
						"d.NullableValue = :nullableValue and " +
						"d.Revision = :revision and " +
						":other1 = :other2")
					.SetParameter("value", Now, Type)
					.SetParameter("nullableValue", Now, Type)
					.SetParameter("revision", Now, Type)
					.SetParameter("other1", Now, Type)
					.SetParameter("other2", Now, Type);
				driver.ClearStats();
				await (q.ListAsync<DateTimeClass>());
				await (t.CommitAsync());
			}

			AssertSqlType(driver, 5, true);
		}

		/// <summary>
		/// Tests if the type FromStringValue implementation behaves as expected.
		/// </summary>
		/// <param name="timestampValue"></param>
		[Test]
		[TestCase("2011-01-27T15:50:59.6220000+02:00")]
		[TestCase("2011-01-27T14:50:59.6220000+01:00")]
		[TestCase("2011-01-27T13:50:59.6220000Z")]
		[Obsolete]
		public virtual void FromStringValue_ParseValidValues(string timestampValue)
		{
			var timestamp = DateTime.Parse(timestampValue);

			Assert.That(
				timestamp.Kind,
				Is.EqualTo(DateTimeKind.Local),
				"Kind is NOT Local. dotnet framework parses datetime values with kind set to Local and " +
				"time correct to local timezone.");

			var typeKind = GetTypeKind();
			if (typeKind == DateTimeKind.Utc)
				timestamp = timestamp.ToUniversalTime();

			var value = (DateTime) Type.FromStringValue(timestampValue);

			Assert.That(value, Is.EqualTo(timestamp), timestampValue);

			if (typeKind != DateTimeKind.Unspecified)
				Assert.AreEqual(GetTypeKind(), value.Kind, "Unexpected FromStringValue kind");
		}

		private void AssertSqlType(ClientDriverWithParamsStats driver, int expectedCount, bool exactType)
		{
			var typeSqlTypes = Type.SqlTypes(Sfi);
			if (typeSqlTypes.Any(t => t is DateTime2SqlType))
			{
				var expectedType = exactType ? typeSqlTypes.First(t => t is DateTime2SqlType) : SqlTypeFactory.DateTime2;
				Assert.That(
					driver.GetCount(SqlTypeFactory.DateTime),
					Is.EqualTo(0),
					"Found unexpected SqlTypeFactory.DateTime usages.");
				Assert.That(
					driver.GetCount(expectedType),
					Is.EqualTo(expectedCount),
					"Unexpected SqlTypeFactory.DateTime2 usage count.");
				Assert.That(driver.GetCount(DbType.DateTime), Is.EqualTo(0), "Found unexpected DbType.DateTime usages.");
				Assert.That(
					driver.GetCount(expectedType),
					Is.EqualTo(expectedCount),
					"Unexpected DbType.DateTime2 usage count.");
			}
			else if (typeSqlTypes.Any(t => t is DateTimeSqlType))
			{
				var expectedType = exactType ? typeSqlTypes.First(t => t is DateTimeSqlType) : SqlTypeFactory.DateTime;
				Assert.That(
					driver.GetCount(SqlTypeFactory.DateTime2),
					Is.EqualTo(0),
					"Found unexpected SqlTypeFactory.DateTime2 usages.");
				Assert.That(
					driver.GetCount(expectedType),
					Is.EqualTo(expectedCount),
					"Unexpected SqlTypeFactory.DateTime usage count.");
				Assert.That(driver.GetCount(DbType.DateTime2), Is.EqualTo(0), "Found unexpected DbType.DateTime2 usages.");
				Assert.That(driver.GetCount(expectedType), Is.EqualTo(expectedCount), "Unexpected DbType.DateTime usage count.");
			}
			else if (typeSqlTypes.Any(t => Equals(t, SqlTypeFactory.Date)))
			{
				Assert.That(
					driver.GetCount(SqlTypeFactory.DateTime),
					Is.EqualTo(0),
					"Found unexpected SqlTypeFactory.DateTime usages.");
				Assert.That(
					driver.GetCount(SqlTypeFactory.Date),
					Is.EqualTo(expectedCount),
					"Unexpected SqlTypeFactory.Date usage count.");
				Assert.That(driver.GetCount(DbType.DateTime), Is.EqualTo(0), "Found unexpected DbType.DateTime usages.");
				Assert.That(driver.GetCount(DbType.Date), Is.EqualTo(expectedCount), "Unexpected DbType.Date usage count.");
			}
			else if (typeSqlTypes.Any(t => Equals(t, SqlTypeFactory.Int64)))
			{
				Assert.That(
					driver.GetCount(SqlTypeFactory.DateTime),
					Is.EqualTo(0),
					"Found unexpected SqlTypeFactory.DateTime usages.");
				Assert.That(
					driver.GetCount(SqlTypeFactory.Int64),
					Is.EqualTo(expectedCount),
					"Unexpected SqlTypeFactory.Int64 usage count.");
				Assert.That(driver.GetCount(DbType.DateTime), Is.EqualTo(0), "Found unexpected DbType.DateTime usages.");
				Assert.That(driver.GetCount(DbType.Int64), Is.EqualTo(expectedCount), "Unexpected DbType.Int64 usage count.");
			}
			else
			{
				Assert.Ignore("Test does not involve tested types");
			}
		}

		protected virtual long DateAccuracyInTicks => Dialect.TimestampResolutionInTicks;

		protected virtual DateTime Now => GetTypeKind() == DateTimeKind.Utc ? DateTime.UtcNow : DateTime.Now;

		protected virtual DateTime GetTestDate(DateTimeKind kind)
		{
			return AbstractDateTimeType.Round(
					kind == DateTimeKind.Utc ? DateTime.UtcNow : DateTime.SpecifyKind(DateTime.Now, kind),
					DateAccuracyInTicks)
				// Take another date than now for checking the value do not get overridden by seeding.
				.AddDays(1);
		}

		private DateTime GetExpectedValue(DateTime value)
		{
			var expectedValue = value;
			var typeKind = GetTypeKind();
			if (typeKind != DateTimeKind.Unspecified && typeKind != value.Kind && value.Kind != DateTimeKind.Unspecified)
			{
				expectedValue = typeKind == DateTimeKind.Local ? expectedValue.ToLocalTime() : expectedValue.ToUniversalTime();
			}
			return expectedValue;
		}

		/// <summary>
		/// Return a date time still considered equal but as different as possible.
		/// </summary>
		/// <param name="original">The originale date time.</param>
		/// <returns>An equal date time.</returns>
		protected virtual DateTime GetSameDate(DateTime original)
		{
			if (GetTypeKind() != DateTimeKind.Unspecified)
				return new DateTime(original.Ticks, original.Kind);

			switch (original.Kind)
			{
				case DateTimeKind.Local:
					return DateTime.SpecifyKind(original, DateTimeKind.Unspecified);
				case DateTimeKind.Unspecified:
					return DateTime.SpecifyKind(original, DateTimeKind.Utc);
				default:
					return DateTime.SpecifyKind(original, DateTimeKind.Local);
			}
		}

		/// <summary>
		/// Return a different date time but as few different as possible.
		/// </summary>
		/// <param name="original">The originale date time.</param>
		/// <returns>An inequal date time.</returns>
		protected virtual DateTime GetDifferentDate(DateTime original)
		{
			return original.AddTicks(DateAccuracyInTicks);
		}

		private static readonly PropertyInfo _kindProperty =
			typeof(AbstractDateTimeType).GetProperty("Kind", BindingFlags.Instance | BindingFlags.NonPublic);

		protected DateTimeKind GetTypeKind()
		{
			return (DateTimeKind) _kindProperty.GetValue(Type);
		}
	}
}